package com.softserve.repository.impl;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;
import com.softserve.repository.DepartmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class DepartmentRepositoryImpl extends BasicRepositoryImpl<Department, Long> implements DepartmentRepository {

    private static final String DISABLE_FILTER = " AND d.disable = false";

    private static final String HQL_IS_EXISTS_BY_NAME
            = "SELECT CASE WHEN count(d.id) > 0 THEN true ELSE false END "
            + "FROM Department d "
            + "WHERE lower(d.name) = lower(:name)";

    private static final String HQL_IS_EXISTS_BY_NAME_IGNORING_ID
            = "SELECT CASE WHEN count(d.id) > 0 THEN true ELSE false END "
            + "FROM Department d "
            + "WHERE lower(d.name) = lower(:name) AND d.id <> :id";

    private static final String HQL_SELECT_TEACHERS_FOR_DEPARTMENT_ID
            = "SELECT t "
            + "FROM Teacher t "
            + "WHERE t.department.id = :department_id";

    private static final String HQL_SELECT_ALL
            = "SELECT d FROM Department d "
            + "WHERE d.disable = false "
            + "ORDER BY d.name ASC";

    @Override
    public List<Department> getAll() {
        log.info("In getAll()");
        return getSession()
                .createQuery(HQL_SELECT_ALL, Department.class)
                .getResultList();
    }

    @Override
    public Department update(Department entity) {
        getSession().clear();
        return super.update(entity);
    }

    @Override
    public boolean isExistsByName(String name) {
        log.info("In isExistsByName(name = [{}])", name);
        if (name == null) {
            return false;
        }
        return getSession()
                .createQuery(HQL_IS_EXISTS_BY_NAME, Boolean.class)
                .setParameter("name", name)
                .getSingleResult();
    }

    @Override
    public boolean isExistsByNameIgnoringId(String name, Long id) {
        log.info("In isExistsByNameIgnoringId(id = [{}], name = [{}])", id, name);
        if (name == null) {
            return false;
        }
        return getSession()
                .createQuery(HQL_IS_EXISTS_BY_NAME_IGNORING_ID, Boolean.class)
                .setParameter("name", name)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public List<Teacher> getAllTeachers(Long departmentId) {
        log.info("In getAllTeachers(departmentId = [{}])", departmentId);
        return getSession()
                .createQuery(HQL_SELECT_TEACHERS_FOR_DEPARTMENT_ID, Teacher.class)
                .setParameter("department_id", departmentId)
                .getResultList();
    }

    @Override
    protected boolean checkReference(Department department) {
        return getSession()
                .createQuery(HQL_SELECT_TEACHERS_FOR_DEPARTMENT_ID, Teacher.class)
                .setParameter("department_id", department.getId())
                .setMaxResults(1)
                .uniqueResultOptional()
                .isPresent();
    }
}
