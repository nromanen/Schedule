package com.softserve.repository.impl;

import com.softserve.entity.Department;
import com.softserve.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DepartmentRepositoryImpl extends BasicRepositoryImpl<Department, Long> implements DepartmentRepository {
    private static final String HQL_COUNT_BY_NAME_IGNORING_ID
            = "SELECT count(*) "
            + "FROM Department d "
            + "WHERE lower(d.name) = lower(:name) and d.id!=:id";

    private static final String HQL_COUNT_BY_NAME
            = "SELECT count(*)"
            + "FROM Department d "
            + "WHERE lower(d.name) = lower(:name)";

    private static final String HQL_SELECT_TEACHERS_FOR_DEPARTMENT_ID
            = "FROM Teacher t "
            + "WHERE t.department.id = :department_id";

    /**
     * The method used for updating Department
     * @param entity entity is going to be updated
     * @return entity that was updated
     */
    @Override
    public Department update(Department entity) {
        sessionFactory.getCurrentSession().clear();
        return super.update(entity);
    }

    /**
     * The method used for finding out if name exists
     * @param name String name used to find Department
     * @return boolean : if exists - true, else - false
     */
    @Override
    public boolean isNameExists(String name) {
        return countByName(name) != 0;
    }

    /**
     * The method used for finding out if name exists ignoring id
     * @param name String name used to find Department
     * @param id Long id
     * @return boolean : if exists - true, else - false
     */
    @Override
    public boolean isNameExistsIgnoringId(String name, Long id) {
        return countByNameIgnoringId(name, id) != 0;
    }

    @Override
    protected boolean checkReference(Department department) {
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_SELECT_TEACHERS_FOR_DEPARTMENT_ID)
                .setParameter("department_id", department.getId())
                .setMaxResults(1)
                .uniqueResultOptional()
                .isPresent();
    }

    private Long countByName(String name) {
        return (Long) sessionFactory.getCurrentSession()
                .createQuery(HQL_COUNT_BY_NAME)
                .setParameter("name", name)
                .getSingleResult();
    }

    private Long countByNameIgnoringId(String name, Long id) {
        return (Long) sessionFactory.getCurrentSession()
                .createQuery(HQL_COUNT_BY_NAME_IGNORING_ID)
                .setParameter("name", name)
                .setParameter("id", id)
                .getSingleResult();
    }
}
