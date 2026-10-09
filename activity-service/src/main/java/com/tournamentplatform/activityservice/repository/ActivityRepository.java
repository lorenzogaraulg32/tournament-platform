package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ActivityRepository extends MongoRepository<Activity, String> {


    @Query(
            value = """
                    {
                        "$or": [
                            { "actor.id": ?0, "actor.type": ?1 },
                            { "subject.id": ?0, "subject.type": ?1 },
                            { "context.id": ?0, "context.type": ?1 }
                        ]
                    }
                    """,
            sort = "{ 'issuedAt': -1, '_id': -1 }"
    )
    Page<Activity> findActivitiesByEntity(
            String entityId,
            Activity.EntityType entityType,
            Pageable pageable
    );

}
