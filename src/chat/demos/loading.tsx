import React, { useState } from 'react';
import { Button } from 'antd';
import { Chat } from 'dt-design';

export default function () {
    const [loading, setLoading] = useState(true);
    return (
        <>
            <Button onClick={() => setLoading((p) => !p)}>toggle</Button>
            <Chat.Loading loading={loading} />
        </>
    );
}
