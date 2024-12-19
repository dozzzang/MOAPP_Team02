function initMap() {
  // OpenLayers 지도 초기화
  const map = new ol.Map({
    target: "vmap",
    view: new ol.View({
      center: ol.proj.fromLonLat([36, 129),
      zoom: 15,
    }),
    interactions: ol.interaction.defaults().extend([
      new ol.interaction.MouseWheelZoom(), // 마우스 스크롤 확대/축소 활성화
    ]),
    layers: [
      // 기본 VWorld 배경지도 레이어
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: "https://xdworld.vworld.kr/2d/Base/202002/{z}/{x}/{y}.png",
        }),
      }),
    ],
  });
  // WMS 레이어 추가
  function addWMSLayer() {
    const param = {
      name: "범죄주의구간(성폭력)",
      serverUrl:
        "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
      layername: "A2SM_CRMNLHSPOT_TOT",
      styles: "A2SM_CrmnlHspot_Tot_Rape",
    };
    const wmsLayer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: param.serverUrl,
        params: {
          LAYERS: param.layername,
          STYLES: param.styles,
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857", // 좌표계 설정
      }),
    });
    // 지도에 WMS 레이어 추가
    map.addLayer(wmsLayer);
    addLegend();
  }
  // WMS 레이어 추가 호출
  addWMSLayer();
}
// 범례 데이터를 XML에서 로드하는 함수
function addLegend() {
  const legendData = [
    { color: "#ffffb2", grade: "1등급" },
    { color: "#fee88b", grade: "2등급" },
    { color: "#fed165", grade: "3등급" },
    { color: "#fdb751", grade: "4등급" },
    { color: "#fd9b43", grade: "5등급" },
    { color: "#fa7a35", grade: "6등급" },
    { color: "#f45629", grade: "7등급" },
    { color: "#ea3420", grade: "8등급" },
    { color: "#d31a23", grade: "9등급" },
    { color: "#bd0026", grade: "10등급" },
  ];

  const legendContainer = document.createElement("div");
  legendContainer.id = "legend-container";
  legendContainer.style.position = "absolute";
  legendContainer.style.bottom = "20px";
  legendContainer.style.left = "10px";
  legendContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  legendContainer.style.padding = "10px";
  legendContainer.style.borderRadius = "5px";
  legendContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  legendContainer.style.width = "160px";

  const legendTitle = document.createElement("h3");
  legendTitle.textContent = "위험도";
  legendTitle.style.margin = "0";
  legendTitle.style.textAlign = "center";
  legendContainer.appendChild(legendTitle);

  const legendContent = document.createElement("div");
  legendContent.style.display = "grid";
  legendContent.style.gridTemplateColumns = "1fr 1fr"; // 2열로 배치
  legendContent.style.gridAutoRows = "auto";
  legendContent.style.gap = "5px"; // 항목 간 간격 설정

  legendData.forEach((item) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";

    const colorBox = document.createElement("div");
    colorBox.style.width = "15px";
    colorBox.style.height = "15px";
    colorBox.style.backgroundColor = item.color;
    colorBox.style.marginRight = "5px";

    const gradeText = document.createElement("span");
    gradeText.textContent = item.grade;
    gradeText.style.fontSize = "12px";

    legendItem.appendChild(colorBox);
    legendItem.appendChild(gradeText);
    legendContent.appendChild(legendItem);
  });

  legendContainer.appendChild(legendContent);
  document.body.appendChild(legendContainer);
}

                        function setCurrentLocation() {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                        const { latitude, longitude } = position.coords;
                                        const coords = ol.proj.fromLonLat([longitude, latitude]);
                                        map.getView().setCenter(coords);
                                        map.getView().setZoom(15);
                                    },
                                    (error) => {
                                        console.error(`[ERROR] Geolocation failed: ${error.message}`);
                                        alert("현재 위치를 가져올 수 없습니다.");
                                    }
                                );
                            } else {
                                console.error("[ERROR] Geolocation is not supported by this browser.");
                                alert("브라우저가 현재 위치 기능을 지원하지 않습니다.");
                            }
                        }

                        const locationButton = document.createElement("button");
                        locationButton.innerHTML = `<img src="https://img.icons8.com/ios-filled/50/000000/marker.png" alt="현재 위치" style="width: 20px; height: 20px; vertical-align: middle;" />`;
                        locationButton.title = "현재 위치로 이동";
                        locationButton.style.position = "absolute";
                        locationButton.style.bottom = "20px";
                        locationButton.style.right = "10px";
                        locationButton.style.width = "50px";
                        locationButton.style.height = "50px";
                        locationButton.style.backgroundColor = "white";
                        locationButton.style.border = "1px solid #ccc";
                        locationButton.style.borderRadius = "50%";
                        locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
                        locationButton.style.display = "flex";
                        locationButton.style.alignItems = "center";
                        locationButton.style.justifyContent = "center";
                        locationButton.style.cursor = "pointer";
                        locationButton.style.zIndex = 1000;
                        locationButton.onclick = setCurrentLocation;
                        document.body.appendChild(locationButton);
                    }

                    document.addEventListener("DOMContentLoaded", initMap);
                </script>
                <style>
                    #vmap {
                        width: 100%;
                        height: 90vh;
                    }
                    #legend {
                        position: absolute;
                        bottom: 10px;
                        left: 10px;
                        background: white;
                        padding: 10px;
                        border: 1px solid black;
                        border-radius: 5px;
                        font-size: 12px;
                    }
// 지도 초기화
initMap();