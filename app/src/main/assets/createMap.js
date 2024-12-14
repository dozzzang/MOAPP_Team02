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
     controls: ol.control.defaults().extend([
          new ol.control.Zoom({
            zoomInTipLabel: "확대", // 확대 버튼 툴팁
            zoomOutTipLabel: "축소", // 축소 버튼 툴팁
          }),
        ]),
      });
  // WMS 레이어 저장 객체
  const overlayLayers = {
    모두보기: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Tot",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: true, // 기본적으로 활성화
    }),
    강도: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Brglr",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: false,
    }),
    절도: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Theft",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: false,
    }),
    성폭력: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: "https://www.safemap.go.kr/openApiService/wms/getLayerData.do?apikey=TW2ZPXA0-TW2Z-TW2Z-TW2Z-TW2ZPXA04O",
        params: {
          LAYERS: "A2SM_CRMNLHSPOT_TOT",
          STYLES: "A2SM_CrmnlHspot_Tot_Violn",
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        projection: "EPSG:3857",
      }),
      visible: false,
    }),
  };

  // 지도에 오버레이 레이어 추가
  Object.values(overlayLayers).forEach((layer) => map.addLayer(layer));

  // 레이어 선택 UI 추가
  function addLayerControl() {
    const controlContainer = document.createElement("div");
    controlContainer.id = "layer-control";
    controlContainer.style.position = "absolute";
    controlContainer.style.top = "10px";
    controlContainer.style.right = "10px";
    controlContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    controlContainer.style.padding = "10px";
    controlContainer.style.borderRadius = "5px";
    controlContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    controlContainer.innerHTML = `
      <h3 style="margin = 0;">지도에 표시할 빈도 항목을 선택</h3>
      <div>
        <label>
          <input type="checkbox" id="overlay-all" checked /> 모두보기
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="overlay-brglr" /> 강도
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="overlay-theft" /> 절도
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" id="overlay-violn" /> 성폭력
        </label>
      </div>
    `;

    document.body.appendChild(controlContainer);

    // 이벤트 리스너 추가
    const allCheckbox = document.getElementById("overlay-all");
    const brglrCheckbox = document.getElementById("overlay-brglr");
    const theftCheckbox = document.getElementById("overlay-theft");
    const violnCheckbox = document.getElementById("overlay-violn");

    // "모두보기" 체크박스 동작
    allCheckbox.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      Object.keys(overlayLayers).forEach((key) => {
        overlayLayers[key].setVisible(isChecked);
        if (key !== "모두보기") {
          document.getElementById(`overlay-${key}`).checked = isChecked;
        }
      });
    });

    // 개별 항목 체크박스 동작
    brglrCheckbox.addEventListener("change", (event) => {
      overlayLayers["강도"].setVisible(event.target.checked);
      if (!event.target.checked) allCheckbox.checked = false; // 모두보기 해제
    });

    theftCheckbox.addEventListener("change", (event) => {
      overlayLayers["절도"].setVisible(event.target.checked);
      if (!event.target.checked) allCheckbox.checked = false; // 모두보기 해제
    });

    violnCheckbox.addEventListener("change", (event) => {
      overlayLayers["성폭력"].setVisible(event.target.checked);
      if (!event.target.checked) allCheckbox.checked = false; // 모두보기 해제
    });
  }

  // 레이어 컨트롤 UI 호출
  addLayerControl();

function addLegendManually() {
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
  legendContainer.innerHTML = "<h3 style='margin: 0; text-align: center;'>위험도</h3>";

  const legendContent = document.createElement("div");
  legendContent.style.display = "grid";
  legendContent.style.gridTemplateColumns = "1fr 1fr";
  legendContent.style.gap = "5px";

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


  // 현재 위치 기반으로 지도를 이동시키는 함수
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
  addLegendManually();

  // 맵 초기화 시 현재 위치 설정
  setCurrentLocation();

// 현재 위치 버튼 추가
  addCurrentLocationButton();

  // WMS 레이어 추가 호출
  addWMSLayer();
}
const style = document.createElement("style");
style.innerHTML = `
  .ol-zoom {
    background-color: rgba(0, 0, 0, 0.8) !important;
    border-radius: 10px;
    width: 60px;
    height: 60px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    font-size: 24px;
    color: white;
  }
  .ol-zoom-in,
  .ol-zoom-out {
    text-align: center;
  }
`;
document.head.appendChild(style);
// 지도 초기화
initMap();
