package com.taxiapp.api.repository;

import com.taxiapp.api.model.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "user", path = "users")
public interface UserRepository extends PagingAndSortingRepository<User, String>, CrudRepository<User,String> {
}
