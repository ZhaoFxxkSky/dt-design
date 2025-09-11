import React, { useState } from 'react';
import { Float, Image } from 'dt-design';

export default function () {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    return (
        <Float
            draggable={{ bounds: 'body' }}
            position={position}
            onChange={(_, { x, y }) => setPosition({ x, y })}
        >
            <Image
                height={200}
                width={200}
                src="https://dtstack.github.io/dt-design/static/empty_overview.43b0eedf.png"
                style={{ borderColor: 'red' }}
            />
        </Float>
    );
}
