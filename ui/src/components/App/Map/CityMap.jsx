import React, { useState } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer, Polyline, Circle, Polygon, useMapEvents} from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { cityService } from "../../../services/city.service";
// import HashLoader from "react-spinners/HashLoader";

//function colors(x)


function CityMap({tramNodes, tramEdges, busNodes, busEdges, center, subwayEdges, subwayNodes, edges, nodes,max,min,numberСentrality}) {

    function colors(num,x1,x2,x3,x4)
    {
        //ed=360*
   //     console.log(num,x1,x2,x3,x4);
    let x;
    if (Number(num)===1)
    {
        x=x1;
    }
    if (Number(num)===2)
    {
      x=x2;
    }
    if (Number(num)===3)
    {
       x=x3;
    }
    if (Number(num)===4)
    {
       x=x4;
    }        

    
      let  l=0;
      let  r=120;
      let  a=min;
      let  b=max;
      let z= r-(r - l) * (x-a)/(b-a);
    //  console.log(z,a,b);
        return 'hsl('+z+', 100%, 50%)';
    }

    const tramEdgesOptions = { color: 'red' };
    const tramNodesOptions = { color: 'darkred'};
    const busEdgesOptions = { color: '#0000FF' };
    const busNodesOptions = { color: 'darkblue' };
    const subwayEdgesOptions = { color: 'lime'};
    const subwayNodesOptions = { color: '#304D30'};
    const redOptions = {color: 'black'};
    
    const [tramNodes_, setTramNodes] = useState(tramNodes);
    const [tramEdges_, setTramEdges] = useState(tramEdges);
    const [busNodes_, setBusNodes] = useState(busNodes);
    const [busEdges_, setBusEdges] = useState(busEdges);
    const [subwayNodes_, setSubwayNodes] = useState(subwayNodes);
    const [subwayEdges_, setSubwayEdges] = useState(subwayEdges);
    const [edges_, setEdges] = useState(edges);
    const [nodes_, setNodes] = useState(nodes);
    // useEffect(() => {
    //     setTramNodes(tramNodes1);
    // }, []);

    // Press on map
    const [positions, setPositions] = useState([]);
    function LocationGetter() {
        useMapEvents({
              click(e) {
                  setPositions([...positions, e.latlng]);
              }
        });
        return null;
    }
    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
      }
      function getMinOfArray(numArray) {
        return Math.min.apply(null, numArray);
      }
    function transportname(id,yes)
    {
        if (id==1 && yes=='yes')
            return 'Автобус';
        if (id==2 && yes=='yes')
            return 'Трамвай';

    }
    // button handling
    function clear() {
        setPositions([]);
        //setPositions([getFromDb]);
    }

    function saveNodes() {
        const nodesData = nodes_;
        const blob = new Blob([JSON.stringify(nodesData)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); 
        link.download = "nodes.json";
        link.href = url;
        link.click();  
    }

    function saveEdges() {
        const edgesData = edges_;
        const blob = new Blob([JSON.stringify(edgesData)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); 
        link.download = "edges.json";
        link.href = url;
        link.click();  
    }
    async function polygonHandle() {
        let data = {};
        if (positions.length === 0) {
            data = await cityService.getDb();
        }
        else {
            let userPolygon = positions.map((el) => [el.lng, el.lat]);
            userPolygon.push([positions[0].lng, positions[0].lat]);
            data = await cityService.userDb(userPolygon);
        }
        center = [await data.center[1], await data.center[0]];
        setEdges(data.edges);
        setNodes(data.nodes);
    //    setBusEdges(data.edges);
   //     setBusNodes(data.nodes);

      //item.properties.length
      setBusEdges(data.edges.features.filter((el) => (el)).map(item => [item.geometry.coordinates[0],item.geometry.coordinates[1],item.properties.length] ));
    setBusNodes(await data.nodes.features.filter((el) => (el)).map(item => [item.properties.y, item.properties.x, item.id, item.properties.center_count, item.properties.name, item.properties.bus, item.properties.tram, item.properties.closeness_centrality, item.properties.betweenness_centrality, item.properties.pagerank]));
    
 //let   allcenter=(await data.nodes.features.filter((el) => (el)).map(item => [item.properties.center_count]));
 //   console.log(allcenter);
  //  max=Math.max(allcenter);
  //  min=Math.min(allcenter);

    //    setBusEdges(data.edges.features.filter((el) => (el.properties.highway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
   //     setTramEdges(edges.features.filter((el) => (el.properties.railway)).map(item => item.geometry.coordinates.map((el) => ([el[0], el[1]]))));
   //     setTramNodes(await data.nodes.features.filter((el) => (el.properties.tram)).map(item => [item.properties.y, item.properties.x, item.id]));
    //    setBusNodes(await data.nodes.features.filter((el) => (el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]));
   //     setSubwayNodes(data.nodes.features.filter((el) => (!el.properties.tram && !el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]))
   //     setSubwayEdges(data.edges.features.filter((el) => (el.properties.railway && el.properties.railway === 'subway')).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
    }
    // useEffect( () => {
    //     const fetchData = async () => {
    //         let data = {};
    //         if (!exists) {
    //             data = await cityService.getCity(cityname, transport);
    //         }
    //         else {
    //             data = await cityService.getDb();
    //         }
    //         console.log('transport = ', data);
    //         setCenter([data.center[1], data.center[0]]);
    //         setBusEdges(data.edges.features.filter((el) => (el.properties.highway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
    //         setBusNodes(data.nodes.features.filter((el) => (el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]));
    //         setTramEdges(data.edges.features.filter((el) => (el.properties.railway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
    //         setTramNodes(data.nodes.features.filter((el) => (el.properties.tram)).map(item => [item.properties.y, item.properties.x, item.id]));
    //         setIsLoaded(true);
    //     }
    //     fetchData();
    // },  [cityname, transport, exists]);
    // console.log('asdadd', tramEdges);

    return (
        
        <div className={styles.MapContainer}>
            
            <MapContainer className={styles.Map} center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                      Центр города.
  
                    </Popup>
                </Marker>
                <LocationGetter/>

                {/* bus */}
                {(busEdges_.map((el) =>
                    (
                        
                <Polyline pathOptions={busEdgesOptions} positions={[el[1],el[0]]}>
                    <Popup>
                    <p>Данные</p>
                   <p>Длинна {el[2]}</p> 
                    </Popup>
                </Polyline>
                    )
                    ))}
                {(busNodes_.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[1], el[0]]} radius={20} color={colors(numberСentrality,el[3],el[7],el[8],el[9])} >
                        <Popup>
                         <p>Данные</p>
                         <p>osmid: {el[2]}</p>
                         <p>Наименование: {el[4]}</p>
                         <p>Транспорт: {transportname(1,el[5])} {transportname(2,el[6])}</p>
                         <p>Центральность по степени (degree centrality): {el[3]}</p>
                         <p>Центральность по близости (closeness centrality): {el[7]}</p>
                         <p>Центральность по посредничеству (betweenness centrality): {el[8]}</p>
                         <p>Page Rank: {el[9]}</p>
                        </Popup>
                        </Circle>
                    )
                ))}
                {/* tram */}
                <Polyline pathOptions={tramEdgesOptions} positions={tramEdges_}></Polyline>
                {(tramNodes_.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10} pathOptions={tramNodesOptions}></Circle>
                    )
                ))}
                {/* subway */}
                <Polyline pathOptions={subwayEdgesOptions} positions={subwayEdges_}></Polyline>
                {(subwayNodes_.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10} pathOptions={subwayNodesOptions}></Circle>
                    )
                ))}
                <Polygon pathOptions={redOptions} positions={positions}></Polygon>
            </MapContainer>
            <button className={styles.btn} onClick={polygonHandle}>Обработать полигон</button>
            <button className={styles.btn} onClick={clear}>Очистить карту</button>
            <button className={styles.btn} onClick={saveNodes}>Сохранить узлы</button>
            <button className={styles.btn} onClick={saveEdges}>Сохранить рёбра</button>
            <div className={styles.legend}>
                <div className={styles.legendElement}>
                    <hr className={styles.redline}></hr>
                    <span className={styles.objectname}>Трамвайный путь</span>
                </div>
                <div className={styles.legendElement}>
                    <div className={styles.redstop}></div>
                    <span className={styles.objectname}>Трамвайная остановка</span>
                </div>
                <div className={styles.legendElement}>
                    <hr className={styles.blueline}></hr>
                    <span className={styles.objectname}>Автобусный путь</span>
                </div>
                <div className={styles.legendElement}>
                    <div className={styles.bluestop}></div>
                    <span className={styles.objectname}>Автобусная остановка</span>
                </div>
                <div className={styles.legendElement}>
                    <hr className={styles.greenline}></hr>
                    <span className={styles.objectname}>Путь метро</span>
                </div>
                <div className={styles.legendElement}>
                    <div className={styles.greenstop}></div>
                    <span className={styles.objectname}>Остановка метро</span>
                </div>
            </div>

  
        </div>
  )
}

export default CityMap