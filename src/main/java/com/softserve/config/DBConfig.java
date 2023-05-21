package com.softserve.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import liquibase.integration.spring.SpringLiquibase;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@PropertySource("classpath:hibernate.properties")
@EnableTransactionManagement
@Slf4j
public class DBConfig {
    private static final String ENTITY_PACKAGE = "hibernate.entity.package";

    private final Environment environment;

    @Autowired
    public DBConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public DataSource getDataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName(environment.getProperty("database.driver_class"));
        SQLParam param = getParam();
        config.setJdbcUrl(param.url);
        config.setUsername(param.user);
        config.setPassword(param.password);
        config.setMaximumPoolSize(10);
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        return new HikariDataSource(config);
    }

    private record SQLParam(String url, String user, String password) {}

    private SQLParam getParam() {
        String url = System.getenv("HEROKU_DB_URL");
        if (url == null) {
            url = environment.getProperty("database.url");
        }

        String user = System.getenv("HEROKU_DB_USER");
        if (user == null) {
            user = environment.getProperty("database.username");
        }

        String password = System.getenv("HEROKU_DB_PASSWORD");
        if (password == null) {
            password = environment.getProperty("database.password");
        }
        return new SQLParam(url, user, password);
    }

    @Bean
//    @DependsOn("liquibase")
    public LocalSessionFactoryBean getSessionFactory(DataSource dataSource) {
        LocalSessionFactoryBean sessionFactoryBean = new LocalSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);
        Properties properties = new Properties();
        SQLParam param = getParam();
        properties.put("database.url", param.url);
        properties.put("hibernate.dialect", environment.getProperty("database.dialect"));
        sessionFactoryBean.setHibernateProperties(properties);
        sessionFactoryBean.setPackagesToScan("com.softserve.entity");

        return sessionFactoryBean;
    }

    @Bean
    public HibernateTransactionManager getTransactionManager(SessionFactory sessionFactory) {
        HibernateTransactionManager transactionManager = new HibernateTransactionManager();
        transactionManager.setSessionFactory(sessionFactory);
        return transactionManager;
    }

    @Bean
    public SpringLiquibase liquibase(DataSource dataSource) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setChangeLog("classpath:db/changelog/db.changelog-master.yaml");
        liquibase.setDataSource(dataSource);
        liquibase.setShouldRun(environment.getProperty("liquibase.should_run", Boolean.class, Boolean.TRUE));
        return liquibase;
    }

}
