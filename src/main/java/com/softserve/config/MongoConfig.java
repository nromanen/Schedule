package com.softserve.config;


import com.mongodb.MongoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.MongoClientFactoryBean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.softserve.*")
public class MongoConfig /*extends AbstractMongoConfiguration*/ {

  /*  @Override
    protected String getDatabaseName() {
        return "test";
    }

    @Override
    public MongoClient mongoClient() {
        return new MongoClient("127.0.0.1", 27017);
    }

    @Override
    protected String getMappingBasePackage() {
        return "com.softserve.*";
    }*/

    @Bean
    public MongoTemplate mongoTemplate() {
        MongoClient mongoClient = new MongoClient("127.0.0.1", 27017);
        MongoDbFactory mongoDbFactory = new SimpleMongoDbFactory(mongoClient, "helloWorld");
        return new MongoTemplate(mongoDbFactory);
    }
}

