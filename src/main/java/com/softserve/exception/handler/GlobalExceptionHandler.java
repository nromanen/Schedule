package com.softserve.exception.handler;
import com.softserve.exception.*;
import com.softserve.exception.apierror.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.CONFLICT;


@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    //Handles EntityFieldAlreadyExistsException. Triggered when entities field has conflict with already existed field.
    @ExceptionHandler(FieldAlreadyExistsException.class)
    protected ResponseEntity<Object> handleEntityFieldAlreadyExistsException(
            FieldAlreadyExistsException ex) {
        ApiError apiError = new ApiError(CONFLICT);

        //parsing exception message into simple message
        String input = ex.getMessage();
        String[] str = input.split("=");
        List<String> list = new ArrayList<>();
        for (String s : str) {
            s = s.replaceAll("\\{", " ");
            String lastWord = s.substring(s.lastIndexOf(' ') + 1);
            list.add(lastWord);
        }
        list.remove(list.size() - 1);
        StringBuilder fields = new StringBuilder();
        if (list.size() > 1) {
            for (String s : list) {
                fields.append(s).append(", ");
            }
            if (fields.length() > 0) fields.delete(fields.length() - 2, fields.length() - 1);
        } else {
            fields.append(list.get(0));
        }
        int i = input.indexOf(' ');
        String entity = input.substring(0, i);
        String message = entity + " with provided " + fields + " already exists";


        apiError.setMessage(message);
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    //Handles IncorrectTimeException. Happens when time in period is incorrect.
    @ExceptionHandler(IncorrectTimeException.class)
    protected ResponseEntity<Object> handleIncorrectTimeException(
            IncorrectTimeException ex) {
        ApiError apiError = new ApiError(CONFLICT);
        apiError.setMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    //Handles PeriodConflictException. Triggered when period has conflict with already existed periods.
    @ExceptionHandler(PeriodConflictException.class)
    protected ResponseEntity<Object> handlePeriodConflictException(
            PeriodConflictException ex) {
        ApiError apiError = new ApiError(CONFLICT);
        apiError.setMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    // Handles EntityNotFoundException. Created to encapsulate errors with more detail than javax.persistence.EntityNotFoundException.
    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFound(
            EntityNotFoundException ex) {
        ApiError apiError = new ApiError(NOT_FOUND);
        String input = ex.getMessage();
        int i = input.indexOf(' ');
        String entity = input.substring(0, i);
        String builder = entity +
                " was not found";
        apiError.setMessage(builder);
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    // Handles javax.validation.ConstraintViolationException. Thrown when @Validated fails.
    @ExceptionHandler(javax.validation.ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(
            javax.validation.ConstraintViolationException ex) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage("Validation error");
        apiError.addValidationErrors(ex.getConstraintViolations());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    //Handle HttpMessageNotReadableException. Happens when request JSON is malformed.
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ServletWebRequest servletWebRequest = (ServletWebRequest) request;
        log.info("{} to {}", servletWebRequest.getHttpMethod(), servletWebRequest.getRequest().getServletPath());
        String error = "Malformed JSON request";
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.BAD_REQUEST, error, ex));
    }


    // Handle MissingServletRequestParameterException. Triggered when a 'required' request parameter is missing.
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex, HttpHeaders headers,
            HttpStatus status, WebRequest request) {
        String error = ex.getParameterName() + " parameter is missing";
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(BAD_REQUEST, error, ex));
    }

    // Handle HttpMediaTypeNotSupportedException. This one triggers when JSON is invalid as well.
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getContentType());
        builder.append(" media type is not supported. Supported media types are ");
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t).append(", "));
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, builder.substring(0, builder.length() - 2), ex));
    }

    // Handle MethodArgumentNotValidException. Triggered when an object fails @Valid validation.
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage("Validation error");
        apiError.addValidationErrors(ex.getBindingResult().getFieldErrors());
        apiError.addValidationError(ex.getBindingResult().getGlobalErrors());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }


    // Handle HttpMessageNotWritableException.
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String error = "Error writing JSON output";
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, error, ex));
    }

    // Handle NoHandlerFoundException.
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(String.format("Could not find the %s method for URL %s", ex.getHttpMethod(), ex.getRequestURL()));
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    // Handle javax.persistence.EntityNotFoundException
    @ExceptionHandler(javax.persistence.EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFound(javax.persistence.EntityNotFoundException ex) {
        log.error(ex.getMessage());
        return buildResponseEntity(new ApiError(HttpStatus.NOT_FOUND, ex));
    }

    // Handle DataIntegrityViolationException, inspects the cause for different DB causes.
    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex,
                                                                  WebRequest request) {
        log.error(ex.getMessage());
        if (ex.getCause() instanceof ConstraintViolationException) {
            return buildResponseEntity(new ApiError(HttpStatus.CONFLICT, "Unable to execute statement", ex.getCause()));
        }
        return buildResponseEntity(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex));
    }

    // Handle Exception, handle generic Exception.class
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                                      WebRequest request) {
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(String.format("The parameter '%s' of value '%s' could not be converted to type '%s'",
                ex.getName(), ex.getValue(), Objects.requireNonNull(ex.getRequiredType()).getSimpleName()));
        apiError.setDebugMessage(ex.getMessage());
        log.error(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    //Response builder
    private ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }
}
