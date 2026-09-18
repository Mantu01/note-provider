import json, glob
from pathlib import Path
from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.cache import check_semantic_cache
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
import sys

root = Path('E:/products/notes-provider')
out  = root / 'graphify-out'
out.mkdir(parents=True, exist_ok=True)

# ── Step 2: Detect ──────────────────────────────────────────────────────────
detect_result = detect(root)
(out / '.graphify_detect.json').write_text(
    json.dumps(detect_result, ensure_ascii=False), encoding='utf-8')
print(f"Detected {detect_result['total_files']} files, {detect_result['total_words']:,} words")
for cat, flist in detect_result.get('files', {}).items():
    print(f"  {cat}: {len(flist)}")
skipped = detect_result.get('skipped_sensitive', [])
if skipped:
    print(f"Skipped ({len(skipped)}):", skipped[:10])

# ── Step A: AST extraction ──────────────────────────────────────────────────
code_files = []
for f in detect_result.get('files', {}).get('code', []):
    p = Path(f)
    code_files.extend(collect_files(p) if p.is_dir() else [p])

if code_files:
    ast_result = extract(code_files, cache_root=root)
    (out / '.graphify_ast.json').write_text(
        json.dumps(ast_result, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"AST: {len(ast_result['nodes'])} nodes, {len(ast_result['edges'])} edges")
else:
    (out / '.graphify_ast.json').write_text(
        json.dumps({'nodes': [], 'edges': [], 'input_tokens': 0, 'output_tokens': 0}, ensure_ascii=False), encoding='utf-8')
    print("No code files — skipping AST")

# ── Step B: Semantic extraction ─────────────────────────────────────────────
all_sem_files = [f for cat in ('document', 'paper', 'image')
                 for f in detect_result.get('files', {}).get(cat, [])]

SPEC_PATH = Path('C:/Users/Mantu/.claude/skills/graphify/references/extraction-spec.md')
cached_nodes, cached_edges, cached_hyperedges, uncached = check_semantic_cache(
    all_sem_files, root=str(root), prompt_file=str(SPEC_PATH))

if cached_nodes or cached_edges or cached_hyperedges:
    (out / '.graphify_cached.json').write_text(
        json.dumps({'nodes': cached_nodes, 'edges': cached_edges, 'hyperedges': cached_hyperedges}, ensure_ascii=False), encoding='utf-8')
else:
    (out / '.graphify_cached.json').unlink(missing_ok=True)

(out / '.graphify_uncached.txt').write_text('\n'.join(uncached), encoding='utf-8')
print(f"Semantic cache: {len(all_sem_files)-len(uncached)} hit, {len(uncached)} need extraction")

if uncached:
    # For docs/images we rely on Gemini; if not set we just produce empty semantic
    # and let AST carry the structure.  If the user has GEMINI_API_KEY set they'll
    # get richer results from graphify.llm.extract_corpus_parallel().
    spec = "Set GEMINI_API_KEY for semantic extraction, or skip for code-only graph."
    print(f"Tip: {spec}")
    (out / '.graphify_semantic_new.json').write_text(
        json.dumps({'nodes': [], 'edges': [], 'hyperedges': [], 'input_tokens': 0, 'output_tokens': 0}, ensure_ascii=False),
        encoding='utf-8')
else:
    (out / '.graphify_semantic_new.json').write_text(
        json.dumps({'nodes': [], 'edges': [], 'hyperedges': [], 'input_tokens': 0, 'output_tokens': 0}, ensure_ascii=False),
        encoding='utf-8')

(out / '.graphify_uncached.txt').unlink(missing_ok=True)

# Merge cached + new → semantic
cached = json.loads((out / '.graphify_cached.json').read_text(encoding='utf-8')) if (out / '.graphify_cached.json').exists() else {'nodes': [], 'edges': [], 'hyperedges': []}
new_s  = json.loads((out / '.graphify_semantic_new.json').read_text(encoding='utf-8'))
merged_nodes = cached['nodes'] + new_s.get('nodes', [])
seen = {n['id'] for n in merged_nodes}
deduped = []
for n in merged_nodes:
    if n['id'] not in seen:
        deduped.append(n)
        seen.add(n['id'])
semantic = {
    'nodes': deduped,
    'edges': cached.get('edges', []) + new_s.get('edges', []),
    'hyperedges': cached.get('hyperedges', []) + new_s.get('hyperedges', []),
    'input_tokens': new_s.get('input_tokens', 0),
    'output_tokens': new_s.get('output_tokens', 0),
}
(out / '.graphify_semantic.json').write_text(
    json.dumps(semantic, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Semic: {len(deduped)} nodes, {len(semantic['edges'])} edges")

# ── Step C: Merge AST + Semantic ───────────────────────────────────────────
ast = json.loads((out / '.graphify_ast.json').read_text(encoding='utf-8'))
sem = json.loads((out / '.graphify_semantic.json').read_text(encoding='utf-8'))
seen_ids = {n['id'] for n in ast['nodes']}
merged_nodes = list(ast['nodes'])
for n in sem['nodes']:
    if n['id'] not in seen_ids:
        merged_nodes.append(n)
        seen_ids.add(n['id'])
merged = {
    'nodes': merged_nodes,
    'edges': ast['edges'] + sem['edges'],
    'hyperedges': sem.get('hyperedges', []),
    'input_tokens': sem.get('input_tokens', 0),
    'output_tokens': sem.get('output_tokens', 0),
}
(out / '.graphify_extract.json').write_text(
    json.dumps(merged, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Merged: {len(merged_nodes)} nodes, {len(merged['edges'])} edges")

# ── Step 4: Build, cluster, analyse ────────────────────────────────────────
G = build_from_json(merged, root=str(root), directed=False)
if G.number_of_nodes() == 0:
    print("ERROR: Graph is empty")
    sys.exit(1)
communities = cluster(G)
cohesion = score_all(G, communities)
gods = god_nodes(G)
surprises = surprising_connections(G, communities)
labels = {cid: f'Community {cid}' for cid in communities}
questions = suggest_questions(G, communities, labels)

wrote = to_json(G, communities, str(out / 'graph.json'))
if not wrote:
    print("ERROR: refused to shrink graph.json (#479)")
    sys.exit(1)

report = generate(G, communities, cohesion, labels, gods, surprises,
                  detect_result, {'input': merged['input_tokens'], 'output': merged['output_tokens']},
                  str(root), suggested_questions=questions)
(out / 'GRAPH_REPORT.md').write_text(report, encoding='utf-8')
analysis = {
    'communities': {str(k): v for k, v in communities.items()},
    'cohesion': {str(k): v for k, v in cohesion.items()},
    'gods': gods,
    'surprises': surprises,
    'questions': questions,
}
(out / '.graphify_analysis.json').write_text(json.dumps(analysis, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities")

# ── Step 5: Label communities ─────────────────────────────────────────────
# (Already set above; write labels for viz)
(out / '.graphify_labels.json').write_text(
    json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False), encoding='utf-8')
to_json(G, communities, str(out / 'graph.json'), community_labels=labels)
print("Report updated with community labels")

# ── Step 6: HTML ──────────────────────────────────────────────────────────
print("Running html export...")
import subprocess
result = subprocess.run([sys.executable, '-m', 'graphify.export', 'html', '--path', str(out / 'graph.json'), '--out', str(out / 'graph.html')],
                        capture_output=True, text=True)
print(result.stdout, result.stderr)

# ── Step 9: Manifest + cost ───────────────────────────────────────────────
from datetime import datetime, timezone
cost_path = out / 'cost.json'
cost = {'runs': [], 'total_input_tokens': 0, 'total_output_tokens': 0}
if cost_path.exists():
    cost = json.loads(cost_path.read_text(encoding='utf-8'))
cost['runs'].append({
    'date': datetime.now(timezone.utc).isoformat(),
    'input_tokens': merged['input_tokens'],
    'output_tokens': merged['output_tokens'],
    'files': detect_result.get('total_files', 0),
})
cost['total_input_tokens'] += merged['input_tokens']
cost['total_output_tokens'] += merged['output_tokens']
cost_path.write_text(json.dumps(cost, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"This run: {merged['input_tokens']:,} in / {merged['output_tokens']:,} out tokens")

# Clean temp files
for tmp in ['.graphify_detect.json', '.graphify_extract.json', '.graphify_ast.json',
            '.graphify_semantic.json', '.graphify_analysis.json', '.graphify_cached.json',
            '.graphify_semantic_new.json']:
    (out / tmp).unlink(missing_ok=True)
print("\nDone.")
