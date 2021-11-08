export const cardObjectHandler = (card, groupId, semester, link) => {
    return {
        id: Number(card.lessonCardId),
        hours: Number(card.hours),
        subject: {
            id: Number(card.subject.id),
        },
        lessonType: card.type,
        subjectForSite: card.subjectForSite,
        teacher: card.teacher,
        linkToMeeting: link,
        groups: card.groups,
        grouped: card.grouped,
        semester,
    };
};
