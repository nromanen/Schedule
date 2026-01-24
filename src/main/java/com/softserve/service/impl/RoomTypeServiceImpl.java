package com.softserve.service.impl;

import com.softserve.dto.RoomTypeDTO;
import com.softserve.entity.RoomType;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.mapper.RoomTypeMapper;
import com.softserve.repository.RoomTypeRepository;
import com.softserve.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeMapper roomTypeMapper;

    @Override
    @Transactional(readOnly = true)
    public RoomTypeDTO getById(Long id) {
        log.info("Getting room type by id: {}", id);
        RoomType roomType = findRoomTypeById(id);
        return roomTypeMapper.roomTypeToRoomTypeDTO(roomType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomTypeDTO> getAll() {
        log.info("Getting all room types");
        List<RoomType> roomTypes = roomTypeRepository.getAll();
        return roomTypeMapper.roomTypesToRoomTypeDTOs(roomTypes);
    }

    @Override
    public RoomTypeDTO save(RoomTypeDTO roomTypeDTO) {
        log.info("Saving room type: {}", roomTypeDTO);

        if (isRoomTypeExistsWithDescription(roomTypeDTO.getDescription())) {
            throw new FieldAlreadyExistsException(RoomType.class, "description", roomTypeDTO.getDescription());
        }

        RoomType roomType = roomTypeMapper.roomTypeDTOTRoomType(roomTypeDTO);
        RoomType saved = roomTypeRepository.save(roomType);
        return roomTypeMapper.roomTypeToRoomTypeDTO(saved);
    }

    @Override
    public RoomTypeDTO update(RoomTypeDTO roomTypeDTO) {
        log.info("Updating room type: {}", roomTypeDTO);

        if (!isExistsWithId(roomTypeDTO.getId())) {
            throw new EntityNotFoundException(RoomType.class, "id", roomTypeDTO.getId().toString());
        }

        if (isRoomTypeExistsWithDescriptionIgnoringId(roomTypeDTO.getId(), roomTypeDTO.getDescription())) {
            log.error("RoomType with description {} already exists", roomTypeDTO.getDescription());
            throw new FieldAlreadyExistsException(RoomType.class, "description", roomTypeDTO.getDescription());
        }

        RoomType roomType = roomTypeMapper.roomTypeDTOTRoomType(roomTypeDTO);
        RoomType updated = roomTypeRepository.update(roomType);
        return roomTypeMapper.roomTypeToRoomTypeDTO(updated);
    }

    @Override
    public void deleteById(Long id) {
        log.info("Deleting room type by id: {}", id);
        RoomType roomType = findRoomTypeById(id);
        roomTypeRepository.delete(roomType);
    }

    // ==================== Private Helper Methods ====================

    private RoomType findRoomTypeById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RoomType.class, "id", id.toString()));
    }

    private boolean isRoomTypeExistsWithDescription(String description) {
        return roomTypeRepository.countRoomTypesWithDescription(description) != 0;
    }

    private boolean isRoomTypeExistsWithDescriptionIgnoringId(Long id, String description) {
        return roomTypeRepository.countRoomTypesWithDescriptionAndIgnoreId(id, description) != 0;
    }

    private boolean isExistsWithId(Long id) {
        return roomTypeRepository.countByRoomTypeId(id) != 0;
    }
}
