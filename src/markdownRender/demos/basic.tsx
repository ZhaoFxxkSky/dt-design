import React, { useEffect, useState } from 'react';
import { MarkdownRender } from 'dt-design';

export default () => {
    const [value, setValue] = useState('');

    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/dt-design@3.0.8/CHANGELOG.md', {
            method: 'get',
        })
            .then((res) => res.text())
            .then(setValue)
            .catch((err) => {
                setValue(err.message);
            });
    }, []);

    return (
        <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 16 }}>
            <MarkdownRender value={value} />
        </div>
    );
};
