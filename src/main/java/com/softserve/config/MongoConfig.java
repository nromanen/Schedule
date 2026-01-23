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
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

@Configuration
@Slf4j
public class MongoConfig {

    private static final int PORT = 27017;

    @Value("${spring.data.mongodb.host:127.0.0.1}")
    private String defaultServerCluster;

    @Value("${spring.data.mongodb.database:schedules}")
    private String mongoLocalCurrentDatabase;

    // Server MongoDB settings (from environment)
    private String mongoServerCluster = System.getenv("MONGO_CLUSTER");
    private String firstServerClusterForMongo = System.getenv("FIRST_CLUSTER_FOR_MONGO");
    private String secondServerClusterForMongo = System.getenv("SECOND_CLUSTER_FOR_MONGO");
    private String thirdServerClusterForMongo = System.getenv("THIRD_CLUSTER_FOR_MONGO");
    private String mongoServerPassword = System.getenv("MONGO_PASSWORD");
    private String mongoServerUsername = System.getenv("MONGO_USERNAME");
    private String mongoServerMainDatabase = System.getenv("MONGO_MAIN_DATABASE");
    private String mongoServerCurrentDatabase = System.getenv("MONGO_CURRENT_DATABASE");

    @Bean
    @Primary
    public MongoClient mongoClient() {
        if (isServerMongoDB()) {
            log.info("Connecting to MongoDB cluster...");
            MongoCredential credential = MongoCredential.createCredential(
                    mongoServerUsername,
                    mongoServerMainDatabase,
                    mongoServerPassword.toCharArray()
            );
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

        log.info("Connecting to local MongoDB: {}", defaultServerCluster);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyToClusterSettings(builder ->
                        builder.hosts(Collections.singletonList(new ServerAddress(defaultServerCluster, PORT))))
                .build();
        return MongoClients.create(settings);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        String database = isServerMongoDB() ? mongoServerCurrentDatabase : mongoLocalCurrentDatabase;
        return new MongoTemplate(mongoClient, database);
    }

    private boolean isServerMongoDB() {
        return mongoServerUsername != null && mongoServerPassword != null;
    }
}
