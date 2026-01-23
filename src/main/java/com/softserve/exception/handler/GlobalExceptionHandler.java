package com.softserve.exception.handler;

import com.softserve.exception.*;
import com.softserve.exception.apierror.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.ClientAbortException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;

import java.util.Objects;

import static org.springframework.http.HttpStatus.*;


@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(FieldAlreadyExistsException.class)
    protected ResponseEntity<Object> handleEntityFieldAlreadyExistsException(
            FieldAlreadyExistsException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(ex.getShortMessage());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler({IncorrectTimeException.class, IncorrectPasswordException.class,
            ScheduleConflictException.class, PeriodConflictException.class, EntityAlreadyExistsException.class,
            IncorrectEmailException.class, UsedEntityException.class, ParseFileException.class})
    protected ResponseEntity<Object> handleIncorrectFieldExceptions(
            RuntimeException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(ex.getMessage());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<Object> handleAccessDeniedException(
            AccessDeniedException ex) {
        ApiError apiError = new ApiError(FORBIDDEN);
        apiError.setMessage("Access is denied");
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(BadCredentialsException.class)
    protected ResponseEntity<Object> handleBadCredentialsException(
            BadCredentialsException ex) {
        ApiError apiError = new ApiError(UNAUTHORIZED);
        apiError.setMessage("Invalid password or email");
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(com.softserve.exception.EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFound(
            com.softserve.exception.EntityNotFoundException ex) {
        ApiError apiError = new ApiError(NOT_FOUND);
        apiError.setMessage(ex.getShortMessage());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(SortOrderNotExistsException.class)
    protected ResponseEntity<Object> handleSortOrderNotExists(SortOrderNotExistsException exception) {
        ApiError apiError = new ApiError(NOT_FOUND, exception);
        apiError.setMessage(exception.getShortMessage());
        log.error(exception.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage("Validation error");
        apiError.addValidationErrors(ex.getConstraintViolations());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handlePersistenceException(final DataIntegrityViolationException ex) {
        ApiError apiError = new ApiError(INTERNAL_SERVER_ERROR);
        apiError.setMessage(ex.getLocalizedMessage());
        apiError.setDebugMessage(ex.getLocalizedMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(DeleteDisabledException.class)
    protected ResponseEntity<Object> handleDeleteDisabledException(
            DeleteDisabledException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(ex.getMessage());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(MessageNotSendException.class)
    protected ResponseEntity<Object> handleMessageNotSendException(MessageNotSendException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(ex.getMessage());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers,
                                                                  HttpStatusCode status, WebRequest request) {
        ServletWebRequest servletWebRequest = (ServletWebRequest) request;
        log.info("{} to {}", servletWebRequest.getHttpMethod(), servletWebRequest.getRequest().getServletPath());
        String error = "Malformed JSON request";
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.BAD_REQUEST, error, ex));
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        String error = ex.getParameterName() + " parameter is missing";
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(BAD_REQUEST, error, ex));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getContentType());
        builder.append(" media type is not supported. Supported media types are ");
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t).append(", "));
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, builder.substring(0, builder.length() - 2), ex));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage("Validation error");
        apiError.addValidationErrors(ex.getBindingResult().getFieldErrors());
        apiError.addValidationError(ex.getBindingResult().getGlobalErrors());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex, HttpHeaders headers,
                                                                  HttpStatusCode status, WebRequest request) {
        String error = "Error writing JSON output";
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(INTERNAL_SERVER_ERROR, error, ex));
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage("Could not find the " + ex.getHttpMethod() + " method for URL " + ex.getRequestURL());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException ex) {
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.NOT_FOUND, ex));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage("The parameter " + ex.getName() + " of value " + ex.getValue()
                + " could not be converted to type " + Objects.requireNonNull(ex.getRequiredType()).getSimpleName());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        ApiError apiError = new ApiError(UNAUTHORIZED);
        apiError.setMessage("Invalid password or email");
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(FileDownloadException.class)
    protected ResponseEntity<Object> handleFileDownloadException(FileDownloadException ex) {
        ApiError apiError = new ApiError(INTERNAL_SERVER_ERROR);
        apiError.setMessage(ex.getMessage());
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleOtherExceptions(Exception ex) {
        ApiError apiError = new ApiError(INTERNAL_SERVER_ERROR);
        apiError.setMessage("Unexpected error occurred, please refer to the logs for more information");
        apiError.setDebugMessage(ex.getMessage());
        log.error("Unexpected exception: ", ex);
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(ClientAbortException.class)
    protected void handleClientAbort(ClientAbortException ex) {
        log.debug("Client disconnected: {}", ex.getMessage());
    }

    private ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }
}
