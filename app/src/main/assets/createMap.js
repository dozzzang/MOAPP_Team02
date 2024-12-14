function initMap() {
  // OpenLayers 지도 초기화
  const map = new ol.Map({
    target: "vmap",
    view: new ol.View({
      zoom: 15, // 기본 줌 레벨을 15로 설정
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

    // 범례 추가 함수 호출
    loadLegend(param.layername, param.styles);
  }

  // 현재 위치 기반으로 지도를 이동시키는 함수
  function setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = ol.proj.fromLonLat([longitude, latitude]);
          map.getView().setCenter(coords); // 지도 중심을 현재 위치로 이동
          map.getView().setZoom(15); // 줌 레벨 설정
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

  // "현재 위치로 이동" 버튼 생성 및 이벤트 추가
  function addCurrentLocationButton() {
    const button = document.createElement("button");
    button.innerHTML = `<img src="https://img.icons8.com/ios-filled/50/000000/marker.png" alt="현재 위치" style="width: 20px; height: 20px; vertical-align: middle;" />`;
    button.title = "현재 위치로 이동";
    button.style.position = "absolute";
    button.style.bottom = "20px";
    button.style.right = "10px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.backgroundColor = "white";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "50%";
    button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.cursor = "pointer";
    button.style.zIndex = 1000;

    button.onclick = setCurrentLocation;

    document.body.appendChild(button);
  }

  // 맵 초기화 시 현재 위치 설정
  setCurrentLocation();

  // WMS 레이어 추가 호출
  addWMSLayer();

  // 현재 위치 버튼 추가
  addCurrentLocationButton();
}

// 범례 데이터를 XML에서 로드하는 함수
function loadLegend(layer, style) {
  const apiKey = "TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O";

  // 프록시 서버 URL을 사용
  const proxyUrl = `http://10.0.2.2:3000/proxy`; // Node.js 프록시 서버
  const targetUrl = `http://www.safemap.go.kr/legend/legendApiXml.do?apikey=${apiKey}&layer=${layer}&style=${style}`;
  const url = `${proxyUrl}?url=${encodeURIComponent(targetUrl)}`;

  fetch(url)
    .then((response) => {
      console.log(`[DEBUG] Fetch response status: ${response.status}`);
      if (!response.ok) throw new Error("Failed to fetch legend data");
      return response.text();
    })
    .then((xmlString) => {
      // XML 문자열을 DOM 객체로 변환
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");

      // XML에서 범례 데이터를 파싱
      const legends = xmlDoc.getElementsByTagName("legend");
      const legendContent = document.getElementById("legend-content");
      legendContent.innerHTML = ""; // 기존 범례 데이터 초기화

      // 범례 데이터 추가
      for (let i = 0; i < legends.length; i++) {
        const legend = legends[i];
        const color = legend.getElementsByTagName("color")[0].textContent;
        const label = legend.getElementsByTagName("label")[0].textContent;

        const legendItem = document.createElement("div");
        legendItem.innerHTML = `
                  <span style="color: ${color};">●</span> ${label}
              `;
        legendContent.appendChild(legendItem);
      }
    })
    .catch((error) => {
      console.error(`[ERROR] Fetch failed: ${error.message}`);
    });
}

// 지도 초기화
initMap();
