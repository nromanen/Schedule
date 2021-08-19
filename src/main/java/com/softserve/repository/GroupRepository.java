package com.softserve.repository;

import com.softserve.entity.Group;
import java.util.Optional;

public interface GroupRepository extends BasicRepository<Group, Long> {
    Optional<Group> getWithStudentsById(Long id);

    boolean isExistsByTitleIgnoringId(String string, Long id);

    boolean isExistsByTitle(String title);

    boolean isExistsById(Long id);
}
