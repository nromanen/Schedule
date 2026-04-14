import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const loadFont = async (pdf, url, fileName, fontName, fontStyle) => {
    const fontBytes = await fetch(url).then(r => r.arrayBuffer());
    const bytes = new Uint8Array(fontBytes);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const fontBase64 = btoa(binary);
    pdf.addFileToVFS(fileName, fontBase64);
    pdf.addFont(fileName, fontName, fontStyle);
};

const format = (lessons) => {
    if (!lessons?.length) return '';

    const byTeacher = {};
    lessons.forEach(l => {
        const teacher = l.teacher_for_site;
        if (!byTeacher[teacher]) byTeacher[teacher] = [];
        l.groups.forEach(g => byTeacher[teacher].push(g.group_name));
    });

    const teachers = Object.keys(byTeacher);

    if (teachers.length === 1) {
        return `${teachers[0]}\n${byTeacher[teachers[0]].join(', ')}`;
    }

    return teachers.map(teacher =>
        `${teacher}\n${byTeacher[teacher].join(', ')}`
    ).join('\n---\n');
};

export const exportRoomPdf = async (room, days, classes, t) => {
    const pdf = new jsPDF({ orientation: 'landscape' });

    await loadFont(pdf, '/fonts/LiberationSans-Regular.ttf', 'LiberationSans.ttf', 'LiberationSans', 'normal');
    await loadFont(pdf, '/fonts/LiberationSans-Bold.ttf', 'LiberationSans-Bold.ttf', 'LiberationSans', 'bold');

    pdf.setFont('LiberationSans');
    pdf.setFontSize(12);
    pdf.text(`Аудиторія: ${room.room_name} (${room.room_type})`, 14, 12);

    const headers = [['Пара', ...days.map(day => t(`day_of_week_${day}`))]];

    const rows = classes.flatMap(cls => {
        const oddRow = [cls.class_name];
        const evenRow = [''];

        days.forEach(day => {
            const schedule = room.schedules.find(s => s.day === day);
            const classData = schedule?.classes[0];
            const odd = classData?.odd.find(c => c.class_id === cls.id);
            const even = classData?.even.find(c => c.class_id === cls.id);

            oddRow.push(format(odd?.lessons));
            evenRow.push(format(even?.lessons));
        });

        return [oddRow, evenRow];
    });

    const pageWidth = 297;
    const margins = 14;
    const usableWidth = pageWidth - margins * 2;
    const fixedColsWidth = 15;
    const dayColWidth = (usableWidth - fixedColsWidth) / days.length;

    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: 18,
        styles: {
            font: 'LiberationSans',
            fontSize: 12,
        },
        margin: { left: margins },
        headStyles: {
            fillColor: [25, 118, 210],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
        },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center', valign: 'middle' },
            ...days.reduce((acc, _, i) => ({
                ...acc,
                [i + 1]: { cellWidth: dayColWidth },
            }), {}),
        },
        didParseCell: (data) => {
            if (data.section === 'body') {
                const isOdd = data.row.index % 2 === 0;
                data.cell.styles.fillColor = isOdd ? [240, 248, 255] : [255, 255, 255];
                data.cell.styles.lineWidth = {
                    top: isOdd ? 0.4 : 0,
                    bottom: 0,
                };
            }
        },
    });

    pdf.save(`${room.room_name}.pdf`);
};