<script>
	import Swal from 'sweetalert2';
	import 'sweetalert2/src/sweetalert2.scss';
	import { goto } from '$app/navigation';
    import { ingredientsW, servingsW, recipeW, tooltipModeW, recipeTitleW, mobileW, pizzaSizeW } from './stores';
	import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
	import FaPrint from 'svelte-icons/fa/FaPrint.svelte'
	import FaEdit from 'svelte-icons/fa/FaEdit.svelte'
	import {toWords} from 'number-to-words/src/index'


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

	let recipeTitle;
	recipeTitleW.subscribe(value => {
		recipeTitle = value;
	});

	let mobile;
	mobileW.subscribe(value => {
		mobile = value;
	});

	let pizzaSize;
	pizzaSizeW.subscribe(value => {
		pizzaSize = value;
	});

	const Toast = Swal.mixin({
		toast: true,
		position: mobile? 'top': 'top-end',
		showConfirmButton: false,
		timer: 2000
	})

	function calcTotal() {
		let total= 0;
		const ingredientList = Object.keys(ingredients);
		for (const ingredient of ingredientList) {
			total += ingredients[ingredient].measurement;
		}
		return total;
	}

	function editTitle() {
		let preEdit = recipeTitle;
		Swal.fire({
			title: "Edit Title",
			input: "text",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonText: "Save",
			inputValue: preEdit
		}).then((edit) => {
			if (edit.isConfirmed) {
				if (edit.value !== preEdit) {
					recipeTitleW.set(edit.value);
					Toast.fire({
						icon: 'success',
						title: 'Title updated'
					})
				}
			}
		})
	}

	function routeToHome() {
		goto('/') 
	}

	function roundQtr(num) {
		return Math.round(num*4)/4;
	}

</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<div class="container">
	<div class="navbar spaceBetween">
		<div id="hide" class="navbarContainer spaceBetween">
			<div class="tooltipArrowBelow">
				<button class="transparentButton iconLarge" on:click={routeToHome}><FaArrowLeft /></button>
				{#if !tooltipMode}
					<div id="ttBack" class="tooltiptextArrowBelow">
						Navigate back to planner.
					</div>
				{/if}
			</div>
			<div class="tooltipArrowBelow">
				<button class="transparentButton iconLarge" on:click={editTitle}><FaEdit /></button>
				{#if !tooltipMode}
					<div id="ttEdit" class="tooltiptextArrowBelow">
						Edit recipe title.
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
		<hr class="hrNav">
	</div>
	<div id="print" class="column">
		<h1 class="centerText marginAuto title">{recipeTitle}</h1>
		{#if servings > 1}
			<div class="row center servings">Makes {toWords(servings)} {pizzaSize}" pizzas, ~{Math.round(calcTotal()/servings)}g each.</div>
		{/if}
		{#if servings === 1}
			<div class="row center servings">Makes {toWords(servings)} {pizzaSize}" pizza.</div>
		{/if}
		<br>
		<h3 class="centerText setMargin">Ingredient Summary</h3>
		<div class="row spaceEvenly">
			<div class="column"></div>
			<div class="column"></div>
			<div class="column centerText">
				<u>Ingredient</u>
				{#each Object.entries(ingredients) as [name]}
					<div>{name}</div>
				{/each}
			</div>
			<div class="column centerText">
				<u>Measurement</u>
				{#each Object.entries(ingredients) as [name, details]}
					{#if +(details.measurement.toFixed(2) - Math.round(details.measurement)) !== 0}
						<div>{roundQtr(+details.measurement.toFixed(2))}g</div>
					{/if}
					{#if +(details.measurement.toFixed(2) - Math.round(details.measurement)) === 0}
						<div>{details.measurement.toFixed(0)}g</div>
					{/if}
				{/each}
			</div>
			<div class="column centerText">
				<u>Percentage</u>
				<div class="row">
					<div class="column widthAll">
						{#each Object.entries(ingredients) as [name, details]}
							{#if (+(details.percentage * 100).toFixed(2) - Math.round(details.percentage * 100)) !== 0}
								<div>{(details.percentage * 100).toFixed(1)} %</div>
							{/if}
							{#if (+(details.percentage * 100).toFixed(2) - Math.round(details.percentage * 100)) === 0}
								<div>{(details.percentage * 100).toFixed(0)} %</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<div class="column"></div>
			<div class="column"></div>
		</div>
		<br>
		<div class="row spaceBetween">
			<div id="pad1" class="pad"></div>
			<div class="column">
				<h4>Instructions:</h4>
				{#each recipe as step, i}
					<div>{i+1}. {step}<br><br></div>
				{/each}
			</div>
			<div id="pad2" class="pad"></div>
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
		width: 90%;
		height: 100%;
		margin: auto;
	}
	@media print {
		#ttPrint, #ttPrint, #ttEdit {
			visibility: hidden;
		}
		#pad1, #pad2 {
			padding: 0;
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
		position: -webkit-sticky; /* Safari */
		position: sticky;
		top: 0;
		background-color: white;
		z-index: 1;
		width: 100%;
	}
	.navbarContainer {
		margin-top: .5rem;
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.maxHalf {
		width: 50%;
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
		width: max-content;
		min-width: 5%;
		max-width: 25%;
		flex-shrink: 1;
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
		height: 1px;
		border: none;
		background-color: #616161;
	}
	.hrNav {
		margin: 0;
		margin-top: .5rem;
		width: 100%;
		height: 1px;
		border: none;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	.spaceEvenly {
		justify-content: space-evenly;
	}
	.spaceBetween {
		justify-content: space-between;
	}
	.spaceAround {
		justify-content: space-around;
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
		background-color: #616161;
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