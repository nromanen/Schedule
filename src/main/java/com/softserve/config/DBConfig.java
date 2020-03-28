package com.softserve.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.util.Objects;
import java.util.Properties;

import static org.hibernate.cfg.Environment.*;

@Configuration
@PropertySource("classpath:hibernate.properties")
@EnableTransactionManagement
@Slf4j
public class DBConfig {
    private static final String ENTITY_PACKAGE = "hibernate.entity.package";

    private  Environment environment;

    @Autowired
    public DBConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public DataSource getDataSource() {
        String  url= null;
        String  user = null;
        String  password;
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        try {
            dataSource.setDriverClass(Objects.requireNonNull(environment.getProperty(DRIVER)));
        } catch (PropertyVetoException e) {
            System.exit(1);
        }

        try {
            url = System.getenv("HEROKU_DB_URL");
            user = System.getenv("HEROKU_DB_USER");
            password = System.getenv("HEROKU_DB_PASSWORD");

            if(url == null){
                url = Objects.requireNonNull(environment.getProperty(URL));
            }
            if(user == null){
                user = Objects.requireNonNull(environment.getProperty(USER));
            }
            if(password == null){
                password = Objects.requireNonNull(environment.getProperty(PASS));
            }

            dataSource.setJdbcUrl(url);
            dataSource.setUser(user);
            dataSource.setPassword(password);
        }catch (NullPointerException e){
            log.error("Wrong db credential, user: {}, url:{}", user, url);
        }

        return dataSource;
    }


    @Bean
    public LocalSessionFactoryBean getSessionFactory() {
        LocalSessionFactoryBean sessionFactoryBean = new LocalSessionFactoryBean();
        sessionFactoryBean.setDataSource(getDataSource());
        Properties properties = new Properties();

        try {
            String url = Objects.requireNonNull(System.getenv("HEROKU_DB_URL"));
            String user = Objects.requireNonNull(System.getenv("HEROKU_DB_USER"));
            String password = Objects.requireNonNull(System.getenv("HEROKU_DB_PASSWORD"));
            properties.put("hibernate.connection.url", url);
            properties.put("hibernate.connection.username", user);
            properties.put("hibernate.connection.password", password);
        }catch (NullPointerException e){
            log.info("Connect to db with local credential");
        }

        properties.put(SHOW_SQL, Objects.requireNonNull(environment.getProperty(SHOW_SQL)));
        properties.put(HBM2DDL_AUTO, Objects.requireNonNull(environment.getProperty(HBM2DDL_AUTO)));
        properties.put(DIALECT, Objects.requireNonNull(environment.getProperty(DIALECT)));

        properties.put(C3P0_MIN_SIZE, Objects.requireNonNull(environment.getProperty(C3P0_MIN_SIZE)));
        properties.put(C3P0_MAX_SIZE, Objects.requireNonNull(environment.getProperty(C3P0_MAX_SIZE)));
        properties.put(C3P0_ACQUIRE_INCREMENT, Objects.requireNonNull(environment.getProperty(C3P0_ACQUIRE_INCREMENT)));
        properties.put(C3P0_TIMEOUT, Objects.requireNonNull(environment.getProperty(C3P0_TIMEOUT)));
        properties.put(C3P0_MAX_STATEMENTS, Objects.requireNonNull(environment.getProperty(C3P0_MAX_STATEMENTS)));

        sessionFactoryBean.setHibernateProperties(properties);
        sessionFactoryBean.setPackagesToScan(environment.getProperty(ENTITY_PACKAGE));

        return sessionFactoryBean;
    }

    @Bean
    public HibernateTransactionManager getTransactionManager() {
        HibernateTransactionManager transactionManager = new HibernateTransactionManager();
        transactionManager.setSessionFactory(getSessionFactory().getObject());
        return transactionManager;
    }

}
