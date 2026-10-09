package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.ActivityRequest;
import com.tournamentplatform.activityservice.dto.request.ActivityRequestPOST;
import com.tournamentplatform.activityservice.dto.response.ActivityResponse;
import com.tournamentplatform.activityservice.entity.Activity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.ActivityRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ActivityService {


    private final ActivityRepository activityRepository;
    private final ActivityMapper mapper;


    public List<ActivityResponse> getActivityByEntity(ActivityRequest request, int page, int size) {


        Page<Activity> activities = activityRepository.
                findActivitiesByEntity(
                        request.id(),
                        request.entityType(),
                        PageRequest.of(page, size)
                );

        return activities.map(mapper::toResponse).getContent();
    }


    public void postActivity(ActivityRequestPOST request) {
        Activity activity = mapper.toEntity(request);
        activityRepository.save(activity);
    }


}
