import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { HttpError } from '../errors/http.error.js';

// 에러 처리 미들웨어. HttpError 클래스를 이용해 생성된 인스턴스로 처리된 에러들을 모아서 응답 하도록 리팩토링.

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // 조이 유효성 검사 처리
  if (err.isJoi) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: HTTP_STATUS.BAD_REQUEST, message: err.message });
  }
  // HttpError 인스턴스로 에러 처리
  if (err instanceof HttpError.BadRequest) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }
  if (err instanceof HttpError.Unauthorized) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }
  if (err instanceof HttpError.Forbidden) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }
  if (err instanceof HttpError.NotFound) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }
  if (err instanceof HttpError.Conflict) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }
  if (err instanceof HttpError.InternalServerError) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }
  // 나머지 에러 처리
  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: '현재 요청을 처리할 수 없습니다' });
};
