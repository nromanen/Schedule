package com.softserve.config;

import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;


@Configuration
@PropertySource("classpath:mongotest.properties")
@Slf4j
public class MongoConfigTest {

    private static final int PORT = 27017;

    private String mongoServerCluster = System.getenv("MONGO_CLUSTER");
    private String firstServerClusterForMongo = System.getenv("FIRST_CLUSTER_FOR_MONGO");
    private String secondServerClusterForMongo = System.getenv("SECOND_CLUSTER_FOR_MONGO");
    private String thirdServerClusterForMongo = System.getenv("THIRD_CLUSTER_FOR_MONGO");
    private String mongoServerPassword = System.getenv("MONGO_PASSWORD");
    private String mongoServerUsername = System.getenv("MONGO_USERNAME");
    private String mongoServerMainDatabase = System.getenv("MONGO_MAIN_DATABASE");
    private String mongoServerCurrentDatabase = System.getenv("MONGO_CURRENT_DATABASE");

    @Value("${mongo.local.current.database}")
    private String mongoLocalCurrentDatabase;

    @Bean
    public Object getMongoClient() {
        if (isServerMongoDB()) {
            MongoCredential credential = MongoCredential.createCredential(mongoServerUsername, mongoServerMainDatabase, mongoServerPassword.toCharArray());
            MongoClientSettings settings = MongoClientSettings.builder()
                    .credential(credential)
                    .retryWrites(true)
                    .applyToConnectionPoolSettings(builder ->
                            builder.maxConnectionIdleTime(5000, TimeUnit.MILLISECONDS))
                    .applyToSslSettings(builder -> builder.enabled(true))
                    .applyToClusterSettings(builder -> {
                        builder.hosts(Arrays.asList(
                                new ServerAddress(firstServerClusterForMongo, PORT),
                                new ServerAddress(secondServerClusterForMongo, PORT),
                                new ServerAddress(thirdServerClusterForMongo, PORT)
                        ));
                        builder.requiredReplicaSetName(mongoServerCluster);
                    })
                    .build();
            return MongoClients.create(settings);
        }
        return new com.mongodb.MongoClient("127.0.0.1", PORT);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        if (isServerMongoDB()) {
            return new MongoTemplate((MongoClient) getMongoClient(), mongoServerCurrentDatabase);
        }
        return new MongoTemplate((com.mongodb.MongoClient) getMongoClient(), mongoLocalCurrentDatabase);
    }

    private boolean isServerMongoDB() {
        return mongoServerUsername != null && mongoServerPassword != null;
    }
}

