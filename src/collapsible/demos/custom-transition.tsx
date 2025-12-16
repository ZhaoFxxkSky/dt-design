import React, { useState } from 'react';
import { Button, Collapsible } from '@dtjoy/dt-design';
import { Checkbox, InputNumber } from 'antd';

export default function () {
    const [isOpen, setOpen] = useState(false);
    const [motion, setMotion] = useState(true);
    const [duration, setDuration] = useState(250);

    const toggle = () => {
        setOpen(!isOpen);
    };
    const collapsed = (
        <ul>
            <li>
                <p> 捻过花惹了白</p>
            </li>
            <li>
                <p>月下举杯敬沧海</p>
            </li>
            <li>
                <p>憾无穷 人生长恨水长东</p>
            </li>
            <li>
                <p>天涯去后乡关外 听风声诉幽怀</p>
            </li>
            <li>
                <p>繁华落尽终是一场空</p>
            </li>
        </ul>
    );
    return (
        <div>
            <div>
                <Checkbox
                    checked={motion}
                    onChange={(event) => {
                        setMotion(event.target.checked);
                    }}
                >
                    是否开启动画
                </Checkbox>
            </div>
            <label>设置动画时间：</label>
            <InputNumber
                min={0}
                defaultValue={250}
                style={{ width: 120 }}
                onChange={(val) => setDuration(val || 0)}
                step={10}
            />
            <br />
            <Button onClick={toggle}>Toggle</Button>
            <Collapsible isOpen={isOpen} duration={duration} motion={motion}>
                {collapsed}
            </Collapsible>
        </div>
    );
}
