package com.softserve.service.impl;

import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectEmailException;
import com.softserve.exception.IncorrectPasswordException;
import com.softserve.repository.UserRepository;
import com.softserve.service.MailService;
import com.softserve.service.UserService;
import com.softserve.util.PasswordGeneratingUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.text.MessageFormat;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import static org.apache.commons.lang3.StringUtils.containsAny;
import static org.apache.commons.lang3.StringUtils.isMixedCase;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.StringUtils.length;

@Slf4j
@Transactional
@Service
@PropertySource({"classpath:cors.properties"})
public class UserServiceImpl implements UserService {
    @Value("${backend.url}")
    private String url;

    private static final char[] NUMBERS = ("0123456789").toCharArray();

    private static final char[] SPECIAL_CHARACTERS = ("!@#$%^&*").toCharArray();

    public static final String PASSWORD_FOR_SOCIAL_USER = "A&vbSdvSeук4му%ца349ІВмк432ем0!Qfdruevvb";

    private static final String EMAIL_MATCHES = "([a-z0-9][-a-z0-9_\\+\\.]*[a-z0-9])@([a-z0-9][-a-z0-9\\.]*[a-z0-9]\\.(arpa|root|aero|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)|([0-9]{1,3}\\.{3}[0-9]{1,3}))";

    private static final String REGISTRATION_MESSAGE = "Hello, {0}.\n" +
            "You received this email because you requested to registration on our site.\n" +
            "For successful profile activation, you have to follow the next link: ";

    private static final String AUTOMATIC_REGISTRATION_MESSAGE = "Hello, {0}.\n" +
            "You received this email due to automatic registration on our site.\n" +
            "For successful profile activation and signing in, you have to follow the next link and reset password: ";

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    
    private final MailService mailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    /**
     * The method used for getting user by id
     *
     * @param id Identity user id
     * @return User entity
     * @throws EntityNotFoundException if user doesn't exist
     */
    @Override
    public User getById(Long id) {
        log.info("Enter into getById method with id {}", id);
        return userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(User.class, "id", id.toString())
        );
    }

    /**
     * Method gets information about all users from Repository
     *
     * @return List of all users
     */
    @Override
    public List<User> getAll() {
        log.info("Enter into getAll method");
        return userRepository.getAll();
    }

    /**
     * The method used for saving user in database
     *
     * @param object new user
     * @return User entity
     * @throws FieldAlreadyExistsException when some of provided fields already exist in database
     */
    @Override
    public User save(User object) {
        log.info("Enter into save method with entity:{}", object);
        object.setPassword(passwordEncoder.encode(object.getPassword()));
        if (emailExists(object.getEmail())) {
            throw new FieldAlreadyExistsException(User.class, "email", object.getEmail());
        }
        return userRepository.save(object);
    }

    /**
     * The method used for updating user in database
     *
     * @param object updated user
     * @return User entity
     * @throws FieldAlreadyExistsException when some of provided fields already exist in database
     */
    @Override
    public User update(User object) {
        log.info("Enter into update method with entity:{}", object);
        getById(object.getId());
        if (userRepository.findByEmail(object.getEmail()).isPresent() &&
                !Objects.equals(userRepository.findByEmail(object.getEmail()).get().getId(), object.getId())) {
            throw new FieldAlreadyExistsException(User.class, "email", object.getEmail());
        }
        return userRepository.update(object);
    }

    /**
     * Method deletes an existing user from repository
     *
     * @param object user entity to be deleted
     * @return deleted user
     */
    @Override
    public User delete(User object) {
        log.info("Enter into delete method with entity:{}", object);
        return userRepository.delete(object);
    }

    /**
     * The method used for getting User by email from database
     *
     * @param email String email used to find User by it
     * @return User entity
     */
    @Override
    public User findByEmail(String email) {
        log.info("Enter into findByEmail method with email:{}", email);
        return userRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException(User.class, "email", email)
        );
    }

    /**
     * The method used for getting User by token from database
     *
     * @param token String token used to find User by it
     * @return User entity
     */
    @Override
    public User findByToken(String token) {
        log.info("Enter into findByToken method with token:{}", token);
        return userRepository.findByToken(token).orElseThrow(
                () -> new EntityNotFoundException(User.class, "token", token)
        );
    }

    /**
     * The method used for registration User
     *
     * @param user Entity User used for registration User in system
     * @return User entity
     * @throws IncorrectPasswordException when password is incorrect or not strong enough
     */
    @Override
    public User registration(User user) {
        log.info("Enter into registration method  with email:{}", user.getEmail());
        return registration(user, MessageFormat.format(REGISTRATION_MESSAGE, user.getEmail()));
    }

    /**
     * The method used for automatic registration User
     *
     * @param email email used for registration User in system
     * @param role role used for registration User in system
     * @return User entity
     * @throws IncorrectPasswordException when password is incorrect or not strong enough
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public User automaticRegistration(String email, Role role) {
        log.info("Enter into registration method  with email:{} and role:{}", email, role);
        User user = new User();
        user.setRole(role);
        user.setEmail(email);
        user.setPassword(PasswordGeneratingUtil.generatePassword());
        return registration(user, MessageFormat.format(AUTOMATIC_REGISTRATION_MESSAGE, user.getEmail()));
    }

    /**
     * The method used for reset User password
     *
     * @param email used for getting user by email
     */
    @Override
    public void resetPassword(String email) {
        log.info("Enter into resetPassword method  with email:{}", email);
        if (!email.matches(EMAIL_MATCHES)) {
            throw new IncorrectEmailException("Invalid email. Try again, please.");
        }
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            String password = PasswordGeneratingUtil.generatePassword();
            user.setPassword(passwordEncoder.encode(password));
            userRepository.update(user);

            String message = "Hello, " + user.getEmail() + ".\n" +
                    "You received this email because you requested to reset your password.\n" +
                    "Below your can see your new password. After sign in site you should change this password on your new password: ";
            String bodyMessage = message + " \r\n" + "Password: " + password;
            String subject = "Change password";
            mailService.send(user.getEmail(), subject, bodyMessage);
        }
    }

    /**
     * The method used for create User after sign in with Oauth2 Social
     *
     * @param oAuth2User OAuth2User - credentials for save User in db
     * @return User entity
     */
    @Override
    public User createSocialUser(OAuth2User oAuth2User) {
        log.info("Enter into emailExists method with OAuth2User = {}", oAuth2User);
        String email = oAuth2User.getAttribute("email");
        return userRepository.findByEmail(email).orElseGet(() -> saveSocialUser(email));
    }

    /**
     * The method used for getting Optional<User> by email from database
     *
     * @param email String email used to find User by it
     * @return Optional<User> entity
     */
    @Override
    public Optional<User> findSocialUser(String email) {
        log.info("Enter into findSocialUser method with email = {}", email);
        return userRepository.findByEmail(email);
    }

    /**
     * The method used for getting list of users from database, that have role USER in system
     *
     * @return list of entities User
     */
    @Override
    public List<User> getAllUsersWithRoleUser() {
        log.info("Enter into getAllUsersWithRoleUser of UserServiceImpl");
        return userRepository.getAllUsersWithRoleUser();
    }

    /**
     * The method used for change password for current user
     *
     * @param user User entity
     * @param oldPassword String password, that use user for sign in up to now
     * @param newPassword String password, that will use user for sign in in future
     * @return Optional<User> entity
     */
    @Override
    public String changePasswordForCurrentUser(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IncorrectPasswordException("Password you entered is not equal to the current password for this profile");
        }
        if (!isPasswordValid(newPassword)) {
            throw new IncorrectPasswordException();
        }
        return passwordEncoder.encode(newPassword);
    }

    private User registration(User user, String registrationMessage) {
        if (isPasswordValid(user.getPassword())) {
            String token = UUID.randomUUID().toString();
            user.setToken(token);
            User registrationUser = save(user);
            sendRegistrationMail(user, registrationMessage);
            return registrationUser;
        } else {
            throw new IncorrectPasswordException();
        }
    }

    private void sendRegistrationMail(User user, String registrationMessage) {
        String link = url + "activation-page?token=" + user.getToken();
        String message = registrationMessage + " \r\n" + link;
        String subject = "Activation account";
        mailService.send(user.getEmail(), subject, message);
    }

    // method for checking email in database
    private boolean emailExists(String email) {
        log.info("Enter into emailExists method with email:{}", email);
        return userRepository.findByEmail(email).isPresent();
    }

    //check if password valid return true, else - false
    private boolean isPasswordValid(String password) {
        log.info("Enter into isPasswordValid method with password:{}", password);
        return (isNotBlank(password) && isMixedCase(password) && containsAny(password, NUMBERS)
                && containsAny(password, SPECIAL_CHARACTERS) && length(password) >= 8 && length(password) <= 30);
    }

    //save User in db after sign up via social network
    private User saveSocialUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(PASSWORD_FOR_SOCIAL_USER);
        user.setToken(null);
        user.setRole(Role.ROLE_USER);
        return userRepository.save(user);
    }
}
