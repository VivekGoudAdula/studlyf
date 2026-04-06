const uploadImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result as string);
        };

        reader.readAsDataURL(file);
    });
};


const handleLessonPaste = async (
    moduleId: any,
    lessonIdx: number,
    e: React.ClipboardEvent<any>
) => {

    const items = e.clipboardData.items;

    const textarea =
        e.currentTarget as HTMLTextAreaElement;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;

    for (let i = 0; i < items.length; i++) {

        if (items[i].type.indexOf('image') !== -1) {

            const file = items[i].getAsFile();

            if (file) {

                const url =
                    await uploadImageFile(file);

                if (url) {

                    const mod = modules.find(
                        m =>
                            m._id === moduleId ||
                            m.id === moduleId
                    );

                    const lesson =
                        mod?.lessons[lessonIdx];

                    if (
                        lesson?.type === 'text' ||
                        lesson?.type === 'code'
                    ) {

                        const content =
                            lesson.content || '';

                        const newContent =
                            content.substring(0, start) +
                            `\n![image](${url})\n` +
                            content.substring(end);

                        updateLesson(
                            moduleId,
                            lessonIdx,
                            {
                                content: newContent
                            }
                        );

                    } else {

                        updateLesson(
                            moduleId,
                            lessonIdx,
                            {
                                image_url: url
                            }
                        );

                    }

                }

            }

        }

    }

};


const handleLessonDrop = async (
    moduleId: any,
    lessonIdx: number,
    e: React.DragEvent<any>
) => {

    e.preventDefault();

    const file =
        e.dataTransfer.files?.[0];

    const textarea =
        e.currentTarget as HTMLTextAreaElement;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;

    const mod = modules.find(
        m =>
            m._id === moduleId ||
            m.id === moduleId
    );

    const lesson =
        mod?.lessons[lessonIdx];

    if (file && file.type.startsWith('image/')) {

        const url =
            await uploadImageFile(file);

        if (url) {

            if (
                lesson?.type === 'text' ||
                lesson?.type === 'code'
            ) {

                const content =
                    lesson.content || '';

                const newContent =
                    content.substring(0, start) +
                    `\n![image](${url})\n` +
                    content.substring(end);

                updateLesson(
                    moduleId,
                    lessonIdx,
                    {
                        content: newContent
                    }
                );

            } else {

                updateLesson(
                    moduleId,
                    lessonIdx,
                    {
                        image_url: url
                    }
                );

            }

        }

    }

};