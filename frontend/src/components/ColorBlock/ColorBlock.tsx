import React from 'react';
import "./ColorBlock.css";

interface Props {
    color: string;
    colorChange: (color: string) => void;
}

const ColorBlock: React.FC<Props> = ({color, colorChange}) => {
    return (
        <div
            className="color-block"
            onClick={() => colorChange(color)}
        ><div style={{width: 20, height: 20, backgroundColor: color}}/>
        </div>
    );
};

export default ColorBlock;