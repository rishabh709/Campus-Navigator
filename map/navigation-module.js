// navigation-module.js
// Contains the turn-by-turn navigation module with 3D tilted view

// ======================================================
// TURN BY TURN NAVIGATION MODULE WITH 3D TILTED VIEW
// ======================================================

// Global navigation state
window.navigationState = {
	active: false,
	routeCoords: [],
	steps: [],
	currentStepIndex: 0,
	navArrowLayer: null,
	navPanelActive: false,
	geolocationWatch: null,
};

// Helper: Get turn arrow SVG for the direction
function getTurnArrowSVG(direction) {
	// Returns SVG for straight, left turn, right turn
	if (direction.includes("right")) {
		return `<svg viewBox="0 0 100 100" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
			<path d="M 50 10 L 50 60 L 80 60" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
			<polygon points="85,60 95,70 85,80" fill="#333"/>
		</svg>`;
	} else if (direction.includes("left")) {
		return `<svg viewBox="0 0 100 100" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
			<path d="M 50 10 L 50 60 L 20 60" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
			<polygon points="15,60 5,70 15,80" fill="#333"/>
		</svg>`;
	} else {
		return `<svg viewBox="0 0 100 100" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
			<path d="M 50 10 L 50 80" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
			<polygon points="50,85 40,70 60,70" fill="#333"/>
		</svg>`;
	}
}

// Helper: Calculate bearing between two points
function bearing(a, b) {
	const lon1 = (a[0] * Math.PI) / 180;
	const lon2 = (b[0] * Math.PI) / 180;
	const lat1 = (a[1] * Math.PI) / 180;
	const lat2 = (b[1] * Math.PI) / 180;

	const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
	const x =
		Math.cos(lat1) * Math.sin(lat2) -
		Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

	const brng = Math.atan2(y, x);
	return ((brng * 180) / Math.PI + 360) % 360;
}

// Helper: Determine turn direction
function turnDirection(prev, next) {
	let angle = next - prev;
	if (angle > 180) angle -= 360;
	if (angle < -180) angle += 360;

	if (Math.abs(angle) < 20) return "Continue straight";
	if (angle > 20) return "Turn right";
	if (angle < -20) return "Turn left";
	return "Continue";
}

// Helper: Calculate distance between two points
function dist(a, b) {
	return ol.sphere.getDistance(ol.proj.fromLonLat(a), ol.proj.fromLonLat(b));
}

// Helper: Build turn-by-turn steps (with accurate cumulative distance)
function buildTurnByTurn(routeCoords) {
	const steps = [];
	
	// Find all turn points
	const turnPoints = [];
	
	for (let i = 1; i < routeCoords.length - 1; i++) {
		const p1 = routeCoords[i - 1];
		const p2 = routeCoords[i];
		const p3 = routeCoords[i + 1];

		const b1 = bearing(p1, p2);
		const b2 = bearing(p2, p3);

		const dir = turnDirection(b1, b2);
		
		// Only record as a turn point if it's a significant turn (not just "continue")
		if (!dir.includes("Continue straight")) {
			turnPoints.push({
				index: i,
				point: p2,
				direction: dir,
			});
		}
	}
	
	// Add final destination
	turnPoints.push({
		index: routeCoords.length - 1,
		point: routeCoords[routeCoords.length - 1],
		direction: "You have arrived",
	});
	
	// Now calculate distances for each step
	for (let s = 0; s < turnPoints.length; s++) {
		const currentTurnIndex = turnPoints[s].index;
		const nextTurnIndex = s + 1 < turnPoints.length ? turnPoints[s + 1].index : routeCoords.length - 1;
		
		// Sum up distances along the path from current turn to next turn
		let totalDistance = 0;
		for (let i = currentTurnIndex; i < nextTurnIndex; i++) {
			totalDistance += dist(routeCoords[i], routeCoords[i + 1]);
		}
		
		steps.push({
			point: turnPoints[s].point,
			direction: turnPoints[s].direction,
			distance: Math.round(totalDistance),
		});
	}

	return steps;
}

// Create or update 3D tilted navigation panel
function update3DNavPanel() {
	const state = window.navigationState;
	if (!state.active || state.currentStepIndex >= state.steps.length) return;

	let navPanel = document.getElementById("nav3dPanel");
	if (!navPanel) {
		navPanel = document.createElement("div");
		navPanel.id = "nav3dPanel";
		navPanel.style.cssText = `
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 45vh;
			background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.98));
			box-shadow: 0 -5px 30px rgba(0,0,0,0.2);
			z-index: 5000;
			padding: 20px;
			font-family: Oxygen, sans-serif;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		`;
		document.body.appendChild(navPanel);
	}

	const currentStep = state.steps[state.currentStepIndex];
	const nextStep = state.steps[state.currentStepIndex + 1];

	let arrowHTML = getTurnArrowSVG(currentStep.direction);
	
	let nextStepHTML = '';
	if (nextStep && state.currentStepIndex + 1 < state.steps.length) {
		nextStepHTML = `
			<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
				<p style="margin: 5px 0; font-weight: bold;">Next: ${nextStep.direction}</p>
				<p style="margin: 5px 0;">${nextStep.distance} m ahead</p>
			</div>
		`;
	}

	navPanel.innerHTML = `
		<div style="text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center;">
			<div style="margin-bottom: 20px;">
				${arrowHTML}
			</div>
			<h2 style="margin: 10px 0; color: #333; font-size: 24px;">${currentStep.direction}</h2>
			<p style="margin: 10px 0; color: #666; font-size: 18px; font-weight: 500;">
				${currentStep.distance > 0 ? currentStep.distance + ' meters' : 'Arriving...'}
			</p>
			${nextStepHTML}
		</div>
		<button id="stopNavBtn" style="
			width: 100%;
			padding: 12px;
			background: #ff6b6b;
			color: white;
			border: none;
			border-radius: 8px;
			font-size: 16px;
			font-weight: bold;
			cursor: pointer;
			margin-top: 10px;
		">End Navigation</button>
	`;

	document.getElementById("stopNavBtn").addEventListener("click", stopNavigation);
}

// Apply 3D tilt to map
function apply3DTilt() {
	const view = map.getView();
	const mapDiv = document.getElementById("map");
	
	// Apply CSS 3D perspective and tilt
	mapDiv.style.perspective = "1200px";
	mapDiv.style.transformStyle = "preserve-3d";
	mapDiv.style.transform = "rotateX(55deg)";
	mapDiv.style.transformOrigin = "center center";
	
	// Adjust pitch/tilt in OpenLayers (if supported by the library version)
	// Some versions support rotation; we'll add a slight rotation for effect
	view.setRotation(0);
}

// Remove 3D tilt
function remove3DTilt() {
	const mapDiv = document.getElementById("map");
	mapDiv.style.transform = "rotateX(0deg)";
	mapDiv.style.perspective = "none";
}

// Start tracking user position during navigation
function startNavigationTracking(routeCoords) {
	if (!navigator.geolocation) {
		alert("Geolocation not supported");
		return;
	}

	if (window.navigationState.geolocationWatch !== null) {
		navigator.geolocation.clearWatch(window.navigationState.geolocationWatch);
	}

	window.navigationState.geolocationWatch = navigator.geolocation.watchPosition(
		(position) => {
			const lon = position.coords.longitude;
			const lat = position.coords.latitude;
			const userLonLat = [lon, lat];

			// Update user marker on map
			window.lastKnownUserCoords = userLonLat;
			updateUserLocation(lon, lat, false);

			// Check if user is near next turn point
			const currentStep = window.navigationState.steps[window.navigationState.currentStepIndex];
			if (currentStep) {
				const distToTurn = dist(userLonLat, currentStep.point);
				// If within 15 meters of turn point, advance to next step
				if (distToTurn < 15 && window.navigationState.currentStepIndex < window.navigationState.steps.length - 1) {
					window.navigationState.currentStepIndex++;
					update3DNavPanel();
				}
			}
		},
		(err) => console.error("Navigation geolocation error:", err),
		{ enableHighAccuracy: true, maximumAge: 1000 }
	);
}

// Stop navigation
window.stopNavigation = function () {
	const state = window.navigationState;
	
	state.active = false;
	state.currentStepIndex = 0;
	state.steps = [];
	state.routeCoords = [];

	// Stop geolocation watch
	if (state.geolocationWatch !== null) {
		navigator.geolocation.clearWatch(state.geolocationWatch);
		state.geolocationWatch = null;
	}

	// Remove nav panel
	const navPanel = document.getElementById("nav3dPanel");
	if (navPanel) navPanel.remove();

	// Remove 3D tilt
	remove3DTilt();

	// Remove arrow layer
	if (state.navArrowLayer) {
		map.removeLayer(state.navArrowLayer);
		state.navArrowLayer = null;
	}

	console.log("Navigation stopped");
};

// Main navigation start function
window.startTurnNavigation = function (routePathIndices) {
	// Convert node indices → lonlat coords
	const routeCoords = routePathIndices.map((i) => nodes[i]);
	const steps = buildTurnByTurn(routeCoords);

	// Update global state
	window.navigationState.active = true;
	window.navigationState.routeCoords = routeCoords;
	window.navigationState.steps = steps;
	window.navigationState.currentStepIndex = 0;

	// Apply 3D tilt
	apply3DTilt();

	// Create and show nav panel
	update3DNavPanel();

	// Start live location tracking during navigation
	startNavigationTracking(routeCoords);

	// Draw route on map (keep it visible for context)
	if (window.routeSource) {
		window.routeSource.clear();
		const lonlats = routeCoords;
		const coords3857 = lonlats.map((c) => ol.proj.fromLonLat(c));
		const feat = new ol.Feature({
			geometry: new ol.geom.LineString(coords3857),
		});
		window.routeSource.addFeature(feat);
	}

	console.log("Navigation started with", steps.length, "steps");
};
