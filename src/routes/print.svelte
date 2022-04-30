<script>
	import { goto } from '$app/navigation';
    import { ingredientsW, servingsW, recipeW, tooltipModeW } from './stores';
	import FaRegArrowAltCircleLeft from 'svelte-icons/fa/FaRegArrowAltCircleLeft.svelte'
	import FaPrint from 'svelte-icons/fa/FaPrint.svelte'

	let servings;
	servingsW.subscribe(value => {
		servings = value;
	});

	let ingredients;
	ingredientsW.subscribe(value => {
		ingredients = value;
	});

	let recipe;
	recipeW.subscribe(value => {
		recipe = value;
	});

	let tooltipMode;
	tooltipModeW.subscribe(value => {
		tooltipMode = value;
	});

	function calcTotal() {
		let total= 0;
		const ingredientList = Object.keys(ingredients);
		for (const ingredient of ingredientList) {
			total += ingredients[ingredient].measurement;
		}
		return total;
	}

	function routeToHome() {
		goto('/') 
	}

</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<div class="container">
	<div id="hide" class="navbar spaceBetween">
		<div class="tooltipArrowBelow">
			<button class="transparentButton iconLarge" on:click={routeToHome}><FaRegArrowAltCircleLeft /></button>
			{#if !tooltipMode}
				<div id="ttBack" class="tooltiptextArrowBelow">
					Navigate back to planner.
				</div>
			{/if}
		</div>
		<div class="tooltipArrowBelow">
			<button class="transparentButton iconLarge" on:click={() => window.print()}><FaPrint /></button>
			{#if !tooltipMode}
				<div id="ttPrint" class="tooltiptextArrowBelow">
					Print recipe!
				</div>
			{/if}
		</div>
	</div>
	<div id="print" class="column">
		<h1 class="centerText marginAuto title">Pizza Dough Recipe</h1>
		{#if servings > 1}
			<div class="row center servings">Makes {servings} pizzas: ~{Math.round(calcTotal()/servings)}g each</div>
		{/if}
		{#if servings === 1}
			<div class="row center servings">Makes {servings} pizza</div>
		{/if}
		<br>
		<h3 class="centerText setMargin">Ingredient Summary</h3>
		<div class="row spaceBetween">
			<div id="pad1" class="column pad"></div>
			<div class="column">
				<u>Ingredient</u>
				{#each Object.entries(ingredients) as [name]}
					<div>{name}</div>
				{/each}
			</div>
			<div class="column">
				<u>Measurement</u>
				{#each Object.entries(ingredients) as [name, details]}
					{#if details.measurement % 1 !== 0}
						<div>{details.measurement.toFixed(2)}g</div>
					{/if}
					{#if details.measurement % 1 === 0}
						<div>{details.measurement.toFixed(0)}g</div>
					{/if}
				{/each}
			</div>
			<div class="column centerText">
				<u>Percentage</u>
				<div class="row">
					<div class="column widthAll">
						{#each Object.entries(ingredients) as [name, details]}
							{#if (details.percentage / .01) - (Math.round(details.percentage * 100)) !== 0}
								<div>{(details.percentage * 100).toFixed(1)} %</div>
							{/if}
							{#if (details.percentage / .01) - (Math.round(details.percentage * 100)) === 0}
								<div>{(details.percentage * 100).toFixed(0)} %</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<div id="pad2" class="column pad"></div>
		</div>
		<br>
		<div class="row">
			<div id="pad3" class="column pad"></div>
			<div class="column">
				<h4>Instructions:</h4>
				{#each Object.entries(recipe) as [number, step]}
					<div>{step}</div><br>
				{/each}
			</div>
			<div id="pad4" class="column pad"></div>
		</div>
	</div>


	<!-- <h1 class="widthAll centerText marginAuto title">Print Recipe</h1><br>
	<div>{servings}</div><br>

	{#each Object.entries(ingredients) as [name, details]}
		<div class="row spaceEvenly">
			{name}
			{#if details.measurement % 1 !== 0}
				<div>{details.measurement.toFixed(2)} g</div>
			{/if}
			{#if details.measurement % 1 === 0}
				<div>{details.measurement.toFixed(0)} g</div>
			{/if}
			{#if (details.percentage / .01) - (Math.round(details.percentage * 100)) !== 0}
				<div>{(details.percentage * 100).toFixed(1)} %</div>
			{/if}
			{#if (details.percentage / .01) - (Math.round(details.percentage * 100)) === 0}
				<div>{(details.percentage * 100).toFixed(0)} %</div>
			{/if}
		</div>
	{/each}
	<br>

	{#each Object.entries(recipe) as [number, step]}
		<div>{step}</div>
	{/each} -->
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
	@media print {
		#ttPrint, #ttPrint {
			visibility: hidden;
		}
		#pad1, #pad2, #pad3, #pad4 {
			padding: 5%;
		}
		#hide {
			visibility: hidden;
		}
		#print {
			height:100%; 
			font-size: 18pt;
		}
	}
	.navbar {
		display: flex;
		flex-direction: row;
		width: 60%;
	}
	.rightText {
		text-align: right;
	}
	.leftText {
		text-align: left;
	}
	.centerText {
		text-align: center;
	}
	.lightText {
		font-size: smaller;
		color: #757575;
	}
	.setMargin {
		margin: .5em;
	}
	.marginBottom {
		margin-bottom: .5em;
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
		padding-left: 10%;
		padding-right: 10%;
	}
	.title {
		padding: .5em;
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

	.iconLarge {
		width: 36px;
		height: 36px;
	}
	.iconLarge:hover {
		transform: translateY(-0.1em);
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
	.servings {
		border: none;
		font-size: 1.25em;
		text-align: center; 
	}
	input {
		border: none;
		border-bottom: 1px solid #BDBDBD;
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

	/* tooltip related */
	.tooltip {
		position: relative;
		display: inline-block;
	}
	.tooltip .tooltiptext {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 225%;
		/* Position the tooltip */
		position: absolute;
		z-index: 1;
		bottom: 100%;
		left: 50%;
		margin-left: -50%;
	}
	.tooltip:hover .tooltiptext {
		visibility: visible;
		opacity: 1;
	}

	.tooltipSmall {
		position: relative;
		display: inline-block;
	}
	.tooltipSmall .tooltiptextSmall {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 50%;
		/* Position the tooltip */
		position: absolute;
		z-index: 1;
		bottom: 100%;
		left: 50%;
		margin-left: -50%;
	}
	.tooltipSmall:hover .tooltiptextSmall {
		visibility: visible;
		opacity: 1;
	}

	.tooltipArrowBelow {
		position: relative;
		display: inline-block;
	}
	.tooltipArrowBelow .tooltiptextArrowBelow {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 300%;
		position: absolute;
		z-index: 1;
	}
	.tooltipArrowBelow:hover .tooltiptextArrowBelow {
		visibility: visible;
		opacity: 1;
	}

	.tooltipArrowAbove {
		position: relative;
		display: inline-block;
	}
	.tooltipArrowAbove .tooltiptextArrowAbove {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 500%;
		bottom: 100%;
		left: 50%;
		position: absolute;
		z-index: 1;
	}
	.tooltipArrowAbove:hover .tooltiptextArrowAbove {
		visibility: visible;
		opacity: 1;
	}
</style>