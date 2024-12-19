function initMap() {
  // OpenLayers 지도 초기화
  const map = new ol.Map({
    target: "vmap",
    view: new ol.View({
      center: ol.proj.fromLonLat([127.5, 36.5]), // 대한민국 중심 좌표
      zoom: 7,
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
  // WMS 레이어 추가 호출
  addWMSLayer();
}
// 범례 데이터를 XML에서 로드하는 함수
function loadLegend(layer, style) {
  const apiKey = "TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O";
  // Safemap API URL
  const targetUrl = `http://www.safemap.go.kr/legend/legendApiXml.do?apikey=${apiKey}&layer=${layer}&style=${style}`;
  fetch(targetUrl)
    .then((response) => {
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
      console.error("Error loading legend:", error);
    });
}
// 지도 초기화
initMap();