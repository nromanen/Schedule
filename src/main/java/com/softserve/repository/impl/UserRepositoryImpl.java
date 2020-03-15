package com.softserve.repository.impl;

import com.softserve.entity.User;
import com.softserve.repository.UserRepository;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl extends BasicRepositoryImpl<User, Long> implements UserRepository {
}
