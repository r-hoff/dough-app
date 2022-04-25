<script>
	import { goto } from '$app/navigation';
	import FaChevronUp from 'svelte-icons/fa/FaChevronUp.svelte'
	import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'
	import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte'
	import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte'
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
	import FaEdit from 'svelte-icons/fa/FaEdit.svelte'
	import FaSave from 'svelte-icons/fa/FaSave.svelte'

	let ingredients = {
		flour: {base: 250, measurement: 250, percentage: 1},
		water: {base: 175, measurement: 175, percentage: .7},
		yeast: {base: 0.5, measurement: 0.5, percentage: .002},
		salt: {base: 6, measurement: 6, percentage: .024},
	}

	let servings = 1;

	function incServings() {
		servings += 1;
		recalcIngredients();
	}

	function decServings() {
		if (servings > 1) {
			servings -= 1;
			recalcIngredients();
		}
	}

	function recalcIngredients() {
		ingredients.flour.measurement = servings * ingredients.flour.base;
		ingredients.water.measurement = servings * ingredients.flour.base * ingredients.water.percentage;
		ingredients.yeast.measurement = servings * ingredients.flour.base * ingredients.yeast.percentage;
		ingredients.salt.measurement = servings * ingredients.flour.base * ingredients.salt.percentage;
	}

	function incWater() {
		ingredients.water.percentage += 0.01;
		recalcIngredients();
	}

	function decWater() {
		if (ingredients.water.percentage > 0) {
			ingredients.water.percentage -= 0.01;
			recalcIngredients();
		}
	}

	function incYeast() {
		ingredients.yeast.percentage += 0.001;
		recalcIngredients();
	}

	function decYeast() {
		if (ingredients.yeast.percentage > 0) {
			ingredients.yeast.percentage -= 0.001;
			recalcIngredients();
		}
	}

	function incSalt() {
		ingredients.salt.percentage += 0.001;
		recalcIngredients();
	}

	function decSalt() {
		if (ingredients.salt.percentage > 0) {
			ingredients.salt.percentage -= 0.001;
			recalcIngredients();
		}
	}

	let metric = false;
	let metricDisplay = "metric";
	let metricSlider = "sliderOn";
	let advanced = false;
	let advancedDisplay = "advanced";
	let advancedSlider = "sliderOn";

	let recipeEdit = false;

	function setMetric() {
		metric = !metric;
		metricSlider === "sliderOn"? metricSlider = "sliderOff": metricSlider = "sliderOn";
		metricDisplay === "metricActive"? metricDisplay = "metric": metricDisplay = "metricActive";
	}

	function setAdvanced() {
		advanced = !advanced;
		advancedSlider === "sliderOn"? advancedSlider = "sliderOff": advancedSlider = "sliderOn";
		advancedDisplay === "advancedActive"? advancedDisplay = "advanced": advancedDisplay = "advancedActive";
	}

	function setRecipeEdit() {
		recipeEdit = !recipeEdit;
	}

	function resetDefaultValues() {
		ingredients = {
			flour: {base: 250, measurement: 250, percentage: 1},
			water: {base: 175, measurement: 175, percentage: .7},
			yeast: {base: 0.5, measurement: 0.5, percentage: .002},
			salt: {base: 6, measurement: 6, percentage: .024},
		}
		recalcIngredients();
	}

	function routeToPrint() {
		goto('/print', { replace: false }) 
	}
	
</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<div class="container">
	<h1>Pizza Dough Planner</h1>
	<div class="row center">
		<label for="servings">How many pizzas would you like to prepare dough for?</label>
		<input id="servings" type="number" bind:value={servings} min=1 max=10/>
		<div class="column">
			<button class="transparentButton icon" on:click={incServings}><FaChevronUp /></button>
			<button class="transparentButton icon" on:click={decServings}><FaChevronDown /></button>
		</div>
	</div>
	<div class="row">
		<div class="column widthAll">
			<h3 class="centerText">Ingredient Summary</h3>
			<div class="row spaceBetween">
				<div class="column">
					<u>Ingredient</u>
					<div>Flour</div>
					<div>Water</div>
					<div>Yeast</div>
					<div>Salt</div>
				</div>
				<div class="column">
					<u>Measurement</u>
					<div>{ingredients.flour.measurement.toFixed(1)} g</div>
					<div>{ingredients.water.measurement.toFixed(1)} g</div>
					<div>{ingredients.yeast.measurement.toFixed(2)} g</div>
					<div>{ingredients.salt.measurement.toFixed(2)} g</div>
				</div>
				<div class="column">
					<u>Percentage</u>
					<div class="row">
						<div class="column rightText">
							<div>{(ingredients.flour.percentage * 100).toFixed(0)} %</div>
							<div>{(ingredients.water.percentage * 100).toFixed(0)} %</div>
							<div>{(ingredients.yeast.percentage * 100).toFixed(1)} %</div>
							<div>{(ingredients.salt.percentage * 100).toFixed(1)} %</div>
						</div>
						{#if advanced}
						<div class="column">
							<div class="row"><br></div>
							<div class="row">
								<button class="transparentButton iconSmall" on:click={decWater}><FaChevronLeft /></button>
								<button class="transparentButton iconSmall" on:click={incWater}><FaChevronRight /></button>
							</div>
							<div class="row">
								<button class="transparentButton iconSmall" on:click={decYeast}><FaChevronLeft /></button>
								<button class="transparentButton iconSmall" on:click={incYeast}><FaChevronRight /></button>
							</div>
							<div class="row">
								<button class="transparentButton iconSmall" on:click={decSalt}><FaChevronLeft /></button>
								<button class="transparentButton iconSmall" on:click={incSalt}><FaChevronRight /></button>
							</div>
						</div>
						{/if}
					</div>
				</div>
			</div>
			{#if advanced}<div class="row"><button class="transparentButton iconSmall"><FaPlus /></button>Add Ingredient</div>{/if}
		</div>
		<div class="column pad"></div>
		<div class="column widthAll">
			<h3 class="centerText">Options</h3>
			<div class="row spaceEvenly options">
				<div class="marginAuto">
					<br>
					<div>Use Cups/Tsp:</div>
					<div class="{metricSlider}">
						<button class="{metricDisplay}" on:click={setMetric}>{metric? "ON": "OFF"}</button>
					</div>
					<br>
				</div>
				<div class="marginAuto">
					<br>
					<div>Pizzaiolo Mode:</div>
					<div class="{advancedSlider}">
						<button class="{advancedDisplay}" on:click={setAdvanced}>{advanced? "ON": "OFF"}</button>
					</div>
					<br>
				</div>
			</div>
			<br>
			<div class="centerText lightText">Activate Pizzaiolo Mode to fine tune your recipe!</div>
		</div>
	</div>
	<br>
	<hr>
	<div class="column">
		<div class="row spaceBetween">
			<h4>Step-by-step Pizza Dough Instructions:</h4>
			{#if advanced}
				{#if !recipeEdit}<button class="transparentButton icon" on:click={setRecipeEdit}><FaEdit /></button>{/if}
				{#if recipeEdit}<button class="transparentButton icon" on:click={setRecipeEdit}><FaSave /></button>{/if}
			{/if}
		</div>
		<p contenteditable="{recipeEdit}">
			1. Heat water to ~100°F (38°C). Dissolve salt in water, then stir in yeast. Let sit for a minute or two.<br><br>
			2. Measure flour into bowl of stand mixer. Add in the water/yeast/salt mixture and stir with a spatula until just combined. 
			Then, mix on low for 3-5 minutes, or until the dough is uniform and smooth. Let rest for 20-30 minutes.<br><br>
			3. After resting, mix dough on low again for 30 seconds. Then, lightly oil another large bowl and transfer the dough ball. 
			Cover with a lid or plastic wrap and let proof for 2 hours at room temperature.<br><br>
			4. Turn out dough onto surface. Cut and shape into equal sized balls 
			(~{Math.round((ingredients.flour.measurement + ingredients.water.measurement + ingredients.yeast.measurement + ingredients.salt.measurement) / servings)}g) 
			and place into a large tupperware or on individual dinner plates. Cover and place in refrigerator for 12-24 hours.<br><br>
			5. Remove dough from refrigerator 30-60 minutes before making pizza. Then stretch, top, and bake!
		</p>
	</div>
	<br>
	<div class="row">
		<div class="widthAll centerText">
			<button class="printReset" on:click={resetDefaultValues}>Reset to Default</button>
		</div>
		<div class="widthAll centerText">
			<button class="printReset" on:click={routeToPrint}>Print Recipe</button>
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Quicksand', sans-serif;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
		height: 100%;
		margin: auto;
	}
	.rightText {
		text-align: right;
	}
	.centerText {
		text-align: center;
	}
	.lightText {
		font-size: smaller;
		color: #757575;
	}
	.center {
		align-items: center;
		justify-content: center;
	}
	.widthAll {
		width: 100%;
	}
	.heightAll {
		height: 100%;
	}
	.pad {
		padding: 3em;
	}
	.marginAuto {
		margin: auto;
	}
	.flexEnd {
		justify-content: flex-end;
	}
	hr {
		width: 100%;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.spaceEvenly {
		justify-content: space-evenly;
	}
	.spaceBetween {
		justify-content: space-between;
	}

	.options {
		background-color: #EEEEEE;
		border-radius: 12px;
	}

	.icon {
		width: 28px;
		height: 28px;
	}
	.iconSmall {
		width: 20px;
		height: 20px;
	}
	button {
		cursor: pointer;
	}
	.transparentButton {
		border: none;
		background-color: transparent;
	}
	.sliderOff {
		width: 4em;
		text-align: right;
		background-color: #283593;
		border-radius: 12px;
	}
	.sliderOn {
		width: 4em;
		text-align: left;
		background-color: #BDBDBD;
		border-radius: 12px;
	}
	.metricActive {
		font-weight: bold;
		background-color: white;
		border-color: #283593;
		border-radius: 12px;
	}
	.metric {
		font-weight: bold;
		color: #757575;
		background-color: white;
		border-color: #BDBDBD;
		border-radius: 12px;
	}
	.advancedActive {
		font-weight: bold;
		background-color: white;
		border-color: #283593;
		border-radius: 12px;
	}
	.advanced {
		font-weight: bold;
		color: #757575;
		background-color: white;
		border-color: #BDBDBD;
		border-radius: 12px;
	}
	input {
		border: none;
		font-size: x-large;
		width: 2em;
		text-align: center; 
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.printReset {
		width: 10em;
		border: 0;
		background-color: #303F9F;
		color: white;
        border-radius: 6px;
        padding: 8px 12px;
        font-weight: bold;
        box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
	}
	.printReset:hover {
		background-color: #283593;
	}
	.printReset:active {
		background-color: #1A237E;
	}
</style>