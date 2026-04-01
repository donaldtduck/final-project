package com.finance.portfolio.config;

import com.finance.portfolio.enums.TimeUnitEnum;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class TimeUnitConverter implements Converter<String, TimeUnitEnum> {

    @Override
    public TimeUnitEnum convert(String source) {
        try {
            return TimeUnitEnum.valueOf(source.toUpperCase());
        } catch (Exception e) {
            return null;
        }
    }
}
