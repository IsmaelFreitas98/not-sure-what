/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

function EnergySphere(props) {

    const {heightPer, widthPer, energyRange} = props;

    const width = document.documentElement.clientWidth * (widthPer / 100);
    const height = document.documentElement.clientHeight * (heightPer / 100);
    
    const [energyPointsArr, setEnergyPointsArr] = useState([]);
    const [energyLinesArr, setEnergyLinesArr] = useState([]);
    const [ranOnce, setRanOnce] = useState(false);
    console.log(energyPointsArr.length);
    
    useEffect(() => {
        if(!ranOnce){
            setRanOnce(true);
            const newPoints = createEnergyPoints(15);
            setEnergyPointsArr([...newPoints]);
        }
    }, []);

    useEffect(() => {
        setEnergyLinesArr(createEnergyLines());
        setTimeout(() => {
            moveEnergyPoints();
        }, 30);
    }, [energyPointsArr]);
    
    const createEnergyPoints = (num) => {

        const newPointsArr = [];

        for(let i = 0; i < num; i++) {
            
            const energyPoint = {};
            let posXPercent, posYPercent, posX, posY, directionX, directionY;
    
            if(Math.random() > 0.5) {
                posXPercent = (Math.random() > 0.5) ? 1 : 0;
                posYPercent = Math.random();
            } else {
                posYPercent = (Math.random() > 0.5) ? 1 : 0;
                posXPercent = Math.random();
            }
    
            posX = Math.round(posXPercent * width);
            posY = Math.round(posYPercent * height);
    
            directionX = (width / 2) - posX;
            directionY = ((height / 2) - posY);
    
            const directionVector = calcModuleVector(directionX, directionY);
    
            energyPoint.posX = posX;
            energyPoint.posY = posY;
            energyPoint.directionX = directionVector[0];
            energyPoint.directionY = directionVector[1];
            energyPoint.speed = Math.random() * 5 + 2;

            newPointsArr.push(energyPoint);
        }

        return newPointsArr;
    }

    const moveEnergyPoints = () => {
        const pointsToMove = [...energyPointsArr];
        const updatedPoints = [];
        let expiredPointsCounter = 0;

        pointsToMove.forEach(point => {
            point.posX += point.directionX * point.speed; 
            point.posY += point.directionY * point.speed;

            if(point.posX > width || point.posX < 0 || point.posY > height || point.posY < 0) {
                expiredPointsCounter++;
            } else {
                updatedPoints.push(point);
            }
        })

        const newPoints = createEnergyPoints(expiredPointsCounter);

        updatedPoints.push(...newPoints);

        setEnergyPointsArr(updatedPoints);
    }

    const createEnergyLines = () => {

        const newLines = [];

        energyPointsArr.forEach(point => {
            energyPointsArr.forEach(otherPoint => {
                if(point === otherPoint) {
                    return;
                }

                const distance = calcDistance(point, otherPoint);

                if(distance < energyRange) {
                    if(JSON.stringify(newLines).includes(JSON.stringify([otherPoint, point]))){
                        return;
                    } else {
                        newLines.push([point, otherPoint]);
                    }
                }
            });
        });

        return newLines;
    }
    
    const calcModuleVector = (directionX, directionY) => {

        const length = Math.sqrt((directionX * directionX) + (directionY * directionY));
        const vectorX = Math.round((directionX / length) * 100) / 100;
        const vectorY = Math.round((directionY / length) * 100) / 100;

        return [vectorX, vectorY];
    }

    const calcDistance = (pointOne, pointTwo) => {

        const difX = pointOne.posX - pointTwo.posX;
        const difY = pointOne.posY - pointTwo.posY;

        const distance = Math.sqrt((difX * difX) + (difY * difY));

        return distance;
    }


    const renderLines = () => {
        return energyLinesArr.map((line, index) => {

            const distance = calcDistance(line[0], line[1]);
            const opacityPerc = Math.round((energyRange - distance) / energyRange * 100) / 100;

            return(
                <svg key={index} height={height} width={width} className="absolute">
                    <line x1={`${line[0].posX}`} y1={`${line[0].posY}`} x2={`${line[1].posX}`} y2={`${line[1].posY}`} style={{stroke:"rgb(255,255,255)", strokeWidth:"1", opacity:`${opacityPerc}`}} />
                </svg>
            );
        })
    }
    
    const renderPoints = () => {
        return energyPointsArr.map((point, index) => {
            return(
                <div key={index} style={{position: "absolute", top:`${point.posY}px`, left:`${point.posX}px`}} className="h-[2px] aspect-square bg-white" >
                </div>
            );
        })
    }

    return(
        <div id="energy-sphere" style={{width: `${width}px`, height: `${height}px`}} className={`relative overflow-hidden bg-slate-950 aspect-[1/1]`}>
            {energyPointsArr.length !== 0 && renderPoints()}
            {energyLinesArr.length !== 0 && renderLines()}
        </div>
    );
}

export default EnergySphere;