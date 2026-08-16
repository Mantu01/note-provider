import { describe, it, expect, vi } from 'vitest'
import { AppError, isAppError, isDuplicateKeyError, duplicateKeyToAppError } from '../../../src/server/lib/errors'
import { ERROR_STATUS } from '../../../src/lib/constants'

describe('errors', () => {
  describe('AppError', () => {
    it('has correct name', () => {
      const error = new AppError('INTERNAL_ERROR', 'fail')
      expect(error.name).toBe('AppError')
    })

    it('stores code, message, and status', () => {
      const error = new AppError('VALIDATION_ERROR', 'Bad input', { name: 'required' })
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.message).toBe('Bad input')
      expect(error.status).toBe(ERROR_STATUS.VALIDATION_ERROR)
      expect(error.fields).toEqual({ name: 'required' })
    })

    it('resolves status from ERROR_STATUS for each error code', () => {
      const codes = Object.keys(ERROR_STATUS) as import('../../../src/lib/types').ErrorCode[]
      for (const code of codes) {
        const error = new AppError(code, 'test message')
        expect(error.status).toBe(ERROR_STATUS[code])
      }
    })

    it('has correct status for VALIDATION_ERROR', () => {
      const error = new AppError('VALIDATION_ERROR', 'msg')
      expect(error.status).toBe(400)
    })

    it('has correct status for UNAUTHORIZED', () => {
      const error = new AppError('UNAUTHORIZED', 'msg')
      expect(error.status).toBe(401)
    })

    it('has correct status for FORBIDDEN', () => {
      const error = new AppError('FORBIDDEN', 'msg')
      expect(error.status).toBe(403)
    })

    it('has correct status for NOT_FOUND', () => {
      const error = new AppError('NOT_FOUND', 'msg')
      expect(error.status).toBe(404)
    })

    it('has correct status for CONFLICT', () => {
      const error = new AppError('CONFLICT', 'msg')
      expect(error.status).toBe(409)
    })

    it('has correct status for PAYMENT_ERROR', () => {
      const error = new AppError('PAYMENT_ERROR', 'msg')
      expect(error.status).toBe(402)
    })

    it('has correct status for RATE_LIMITED', () => {
      const error = new AppError('RATE_LIMITED', 'msg')
      expect(error.status).toBe(429)
    })

    it('has correct status for PAYLOAD_TOO_LARGE', () => {
      const error = new AppError('PAYLOAD_TOO_LARGE', 'msg')
      expect(error.status).toBe(413)
    })

    it('has correct status for UNSUPPORTED_MEDIA_TYPE', () => {
      const error = new AppError('UNSUPPORTED_MEDIA_TYPE', 'msg')
      expect(error.status).toBe(415)
    })

    it('has correct status for INTERNAL_ERROR', () => {
      const error = new AppError('INTERNAL_ERROR', 'msg')
      expect(error.status).toBe(500)
    })

    describe('validation factory', () => {
      it('creates AppError with VALIDATION_ERROR code and optional fields', () => {
        const error = AppError.validation({ name: 'required', email: 'invalid' })
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('VALIDATION_ERROR')
        expect(error.status).toBe(400)
        expect(error.fields).toEqual({ name: 'required', email: 'invalid' })
        expect(error.message).toBe('Please check the highlighted fields')
      })

      it('validation factory accepts custom message', () => {
        const error = AppError.validation({}, 'Custom message')
        expect(error.message).toBe('Custom message')
      })
    })

    describe('unauthorized factory', () => {
      it('creates AppError with UNAUTHORIZED code', () => {
        const error = AppError.unauthorized()
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('UNAUTHORIZED')
        expect(error.status).toBe(401)
      })

      it('unauthorized factory accepts custom message', () => {
        const error = AppError.unauthorized('Custom unauthorized message')
        expect(error.message).toBe('Custom unauthorized message')
      })
    })

    describe('forbidden factory', () => {
      it('creates AppError with FORBIDDEN code', () => {
        const error = AppError.forbidden()
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('FORBIDDEN')
        expect(error.status).toBe(403)
      })

      it('forbidden factory accepts custom message', () => {
        const error = AppError.forbidden('Custom forbidden message')
        expect(error.message).toBe('Custom forbidden message')
      })
    })

    describe('notFound factory', () => {
      it('creates AppError with NOT_FOUND code and default entity message', () => {
        const error = AppError.notFound()
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('NOT_FOUND')
        expect(error.status).toBe(404)
        expect(error.message).toBe('Resource not found')
      })

      it('notFound factory uses custom entity name', () => {
        const error = AppError.notFound('User')
        expect(error.message).toBe('User not found')
      })
    })

    describe('conflict factory', () => {
      it('creates AppError with CONFLICT code', () => {
        const error = AppError.conflict('Already exists')
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('CONFLICT')
        expect(error.status).toBe(409)
        expect(error.message).toBe('Already exists')
      })
    })

    describe('payment factory', () => {
      it('creates AppError with PAYMENT_ERROR code', () => {
        const error = AppError.payment()
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('PAYMENT_ERROR')
        expect(error.status).toBe(402)
        expect(error.message).toBe('Payment could not be processed. Please try again.')
      })

      it('payment factory accepts custom message', () => {
        const error = AppError.payment('Custom payment message')
        expect(error.message).toBe('Custom payment message')
      })
    })

    describe('rateLimited factory', () => {
      it('creates AppError with RATE_LIMITED code', () => {
        const error = AppError.rateLimited()
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('RATE_LIMITED')
        expect(error.status).toBe(429)
        expect(error.message).toBe('Too many attempts. Please try again in a few minutes.')
      })

      it('rateLimited factory accepts custom message', () => {
        const error = AppError.rateLimited('Custom rate limited message')
        expect(error.message).toBe('Custom rate limited message')
      })
    })

    describe('payloadTooLarge factory', () => {
      it('creates AppError with PAYLOAD_TOO_LARGE code', () => {
        const error = AppError.payloadTooLarge('File too big')
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('PAYLOAD_TOO_LARGE')
        expect(error.status).toBe(413)
        expect(error.message).toBe('File too big')
      })
    })

    describe('unsupportedMediaType factory', () => {
      it('creates AppError with UNSUPPORTED_MEDIA_TYPE code', () => {
        const error = AppError.unsupportedMediaType('Not allowed')
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('UNSUPPORTED_MEDIA_TYPE')
        expect(error.status).toBe(415)
        expect(error.message).toBe('Not allowed')
      })
    })

    describe('internal factory', () => {
      it('creates AppError with INTERNAL_ERROR code', () => {
        const error = AppError.internal()
        expect(error).toBeInstanceOf(AppError)
        expect(error.code).toBe('INTERNAL_ERROR')
        expect(error.status).toBe(500)
        expect(error.message).toBe('Something went wrong. Please try again.')
      })

      it('internal factory accepts custom message', () => {
        const error = AppError.internal('Database connection failed')
        expect(error.message).toBe('Database connection failed')
      })
    })
  })

  describe('isAppError', () => {
    it('returns true for AppError instances', () => {
      expect(isAppError(new AppError('INTERNAL_ERROR', 'fail'))).toBe(true)
    })

    it('returns false for plain errors', () => {
      expect(isAppError(new Error('fail'))).toBe(false)
    })

    it('returns false for non-error objects', () => {
      expect(isAppError({ message: 'fail' })).toBe(false)
    })

    it('returns false for null', () => {
      expect(isAppError(null)).toBe(false)
    })

    it('returns false for strings', () => {
      expect(isAppError('error')).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isAppError(undefined)).toBe(false)
    })

    it('narrows to AppError type', () => {
      const err: unknown = new AppError('NOT_FOUND', 'missing')
      if (isAppError(err)) {
        expect(err.code).toBe('NOT_FOUND')
        expect(err.status).toBe(404)
      }
    })
  })

  describe('isDuplicateKeyError', () => {
    it('returns true for duplicate key errors with code 11000', () => {
      const error = { code: 11000, keyPattern: { slug: 1 } }
      expect(isDuplicateKeyError(error)).toBe(true)
    })

    it('returns true for duplicate key error with just code', () => {
      const error = { code: 11000 }
      expect(isDuplicateKeyError(error)).toBe(true)
    })

    it('returns false for non-object values', () => {
      expect(isDuplicateKeyError(null)).toBe(false)
      expect(isDuplicateKeyError(undefined)).toBe(false)
      expect(isDuplicateKeyError('string')).toBe(false)
      expect(isDuplicateKeyError(123)).toBe(false)
    })

    it('returns false for objects without code property', () => {
      expect(isDuplicateKeyError({ message: 'fail' })).toBe(false)
    })

    it('returns false for objects with wrong code value', () => {
      expect(isDuplicateKeyError({ code: 11001 })).toBe(false)
      expect(isDuplicateKeyError({ code: 0 })).toBe(false)
      expect(isDuplicateKeyError({ code: '11000' })).toBe(false)
    })
  })

  describe('duplicateKeyToAppError', () => {
    it('maps slug field to appropriate conflict message', () => {
      const error = { code: 11000, keyPattern: { slug: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('An item with this title already exists')
    })

    it('maps email field to appropriate conflict message', () => {
      const error = { code: 11000, keyPattern: { email: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('An account with this email already exists')
    })

    it('maps name field to appropriate conflict message', () => {
      const error = { code: 11000, keyPattern: { name: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('An item with this name already exists')
    })

    it('maps orderNumber field to appropriate conflict message', () => {
      const error = { code: 11000, keyPattern: { orderNumber: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('Duplicate order number, please retry')
    })

    it('maps razorpayOrderId field to appropriate conflict message', () => {
      const error = { code: 11000, keyPattern: { razorpayOrderId: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('This payment order already exists')
    })

    it('falls back to generic message for unknown fields', () => {
      const error = { code: 11000, keyPattern: { phoneNumber: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('Duplicate value for phoneNumber')
    })

    it('falls back to generic message when keyPattern is missing', () => {
      const error = { code: 11000 }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('Duplicate value for value')
    })

    it('falls back to generic message when keyPattern is null', () => {
      const error = { code: 11000, keyPattern: null } as any
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('Duplicate value for value')
    })

    it('falls back to generic message when keyPattern is undefined', () => {
      const error = { code: 11000 }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('Duplicate value for value')
    })

    it('uses first key when keyPattern has multiple keys', () => {
      const error = { code: 11000, keyPattern: { slug: 1, email: 1 } }
      const appError = duplicateKeyToAppError(error)
      expect(appError.code).toBe('CONFLICT')
      expect(appError.message).toBe('An item with this title already exists')
    })
  })
})
