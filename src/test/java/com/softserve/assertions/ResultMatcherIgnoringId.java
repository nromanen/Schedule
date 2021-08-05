package com.softserve.assertions;

import org.springframework.test.web.servlet.ResultMatcher;
import java.util.function.Function;

@FunctionalInterface
public interface ResultMatcherIgnoringId<T> extends Function<T, ResultMatcher> {
}
