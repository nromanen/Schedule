export const cardObjectHandler = (card, groupId, semester) => {
    const groupData =
        card.groups.map((group) => group.id).includes(groupId) && card.groups.length !== 1
            ? { groups: card.groups }
            : { groups: [{ id: groupId }] };
    return {
        ...groupData,
        id: Number(card.lessonCardId),
        hours: Number(card.hours),
        subject: {
            id: Number(card.subject),
        },
        lessonType: card.type,
        subjectForSite: card.subjectForSite,
        teacher: { id: Number(card.teacher) },
        linkToMeeting: card.linkToMeeting,
        grouped: card.grouped,
        semester,
    };
};
