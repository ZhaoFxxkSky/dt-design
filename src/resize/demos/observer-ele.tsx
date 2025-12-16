import React, { useCallback, useRef, useState } from 'react';
import { Resize } from '@dtjoy/dt-design';

export default () => {
    const [clientWidth, setWidth] = useState(0);
    const [clientHegiht, setHegiht] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const onResize = useCallback(() => {
        setWidth(textareaRef.current?.clientWidth || 0);
        setHegiht(textareaRef.current?.clientHeight || 0);
    }, []);

    return (
        <Resize onResize={onResize} observerEle={textareaRef.current}>
            <textarea
                ref={textareaRef}
                style={{
                    resize: 'both',
                    maxWidth: '100%',
                }}
            />
            <pre>当前元素的可视宽: {clientWidth}</pre>
            <pre>当前元素的可视宽: {clientHegiht}</pre>
        </Resize>
    );
};
