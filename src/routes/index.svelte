<script>
	import Swal from 'sweetalert2';
	import 'sweetalert2/src/sweetalert2.scss';
	import { goto } from '$app/navigation';
	import { ingredientsW, servingsW, recipeW, tooltipModeW, advancedModeW, showWelcomeMessageW } from './stores';
	import FaChevronUp from 'svelte-icons/fa/FaChevronUp.svelte'
	import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'
	import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte'
	import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte'
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
	import FaEdit from 'svelte-icons/fa/FaEdit.svelte'
	import FaSave from 'svelte-icons/fa/FaSave.svelte'
	import FaTimes from 'svelte-icons/fa/FaTimes.svelte'
	import FaRegWindowClose from 'svelte-icons/fa/FaRegWindowClose.svelte'

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

	let showWelcomeMessage;
	showWelcomeMessageW.subscribe(value => {
		showWelcomeMessage = value;
	});

	let tooltipMode;
	tooltipModeW.subscribe(value => {
		tooltipMode = value;
	});

	let advancedMode;
	advancedModeW.subscribe(value => {
		advancedMode = value;
	});

	function incServings() {
		servingsW.update(value => value + 1);
		// servings += 1;
		recalcIngredients();
	}

	function decServings() {
		if (servings > 1) {
			servingsW.update(value => value - 1);
			// servings -= 1;
			recalcIngredients();
		}
	}

	function recalcIngredients() {
		const ingredientList = Object.keys(ingredients);

		for (const ingredient of ingredientList) {
			if (ingredient !== "Flour") {
				ingredients[ingredient].measurement = +((servings * ingredients.Flour.base * ingredients[ingredient].percentage).toFixed(2));
			}
			else {
				ingredients.Flour.measurement = ingredients.Flour.base * servings;
			}
		}
	}

	function decIngredientPercentage(ingredient) {
		let increment;
		// change increment if over 5%
		if (ingredients[ingredient].percentage > .05) {
			increment = 0.01;
		} else if (ingredients[ingredient].percentage <= .05) {
			increment = 0.001;
		}
		// only change the percentage if it stays at or above 0%
		if (+((ingredients[ingredient].percentage - increment).toFixed(3)) >= 0) {
			ingredients[ingredient].percentage -= increment;
			recalcIngredients();
		}
	}

	function incIngredientPercentage(ingredient) {
		let increment;
		// change increment if over 5%
		if (ingredients[ingredient].percentage > .05) {
			increment = 0.01;
		} else if (ingredients[ingredient].percentage <= .05) {
			increment = 0.001;
		}
		// only change the percentage if it stays at or below 100%
		if (+((ingredients[ingredient].percentage + increment).toFixed(3)) <= 1) {
			ingredients[ingredient].percentage += increment;
			recalcIngredients();
		}
	}
	
	let recipeEdit = false;
	let preEdit = {};
	function setRecipeEdit() {
		preEdit = Object.assign(preEdit, recipe)
		recipeEdit = !recipeEdit;
	}

	function saveRecipeEdit() {
		// make changes
		recipeEdit = !recipeEdit;
		recipeW.set({
			pt1: recipe.pt1,
			pt2: recipe.pt2,
			pt3: recipe.pt3,
			pt4: recipe.pt4,
			pt5: recipe.pt5,
		});

		Swal.fire({
			title: "Success!",
			icon: 'success',
			text: "Edits were applied.",
		});
	}

	function exitRecipeEdit() {
		Swal.fire({
			title: "Cancel Edit Instructions",
			icon: 'question',
			text: "Any changes made will be lost. Would you like to continue?",
			showCancelButton: true,
			cancelButtonText: "No",
			confirmButtonText: "Yes"
		}).then((result) => {
			if (result.isConfirmed) {
				recipeW.set({
					pt1: preEdit.pt1,
					pt2: preEdit.pt2,
					pt3: preEdit.pt3,
					pt4: preEdit.pt4,
					pt5: preEdit.pt5,
				});
				recipeEdit = !recipeEdit;
			}
		})
	}

	function resetDefaultValues() {
		Swal.fire({
				title: "Reset to Default",
				icon: 'question',
				text: "All ingredients, percentages, servings, and recipe content will be reset. Would you like to continue?",
				showCancelButton: true,
				confirmButtonText: "Yes",
				cancelButtonText: "No"
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
				title: 'Success!',
				text: 'Default values were restored.',
				icon: 'success'
				})
				servingsW.set(1);
				ingredientsW.set({
					Flour: {base: 250, measurement: 250, percentage: 1},
					Water: {base: 175, measurement: 175, percentage: .7},
					Yeast: {base: 0.5, measurement: 0.5, percentage: .002},
					Salt: {base: 6, measurement: 6, percentage: .024},
				});
				recipeW.set({
					pt1: "1. Heat Water to ~100°F (38°C). Dissolve Salt in Water, then stir in Yeast. Let sit for a minute or two.",
					pt2: "2. Measure Flour into bowl of stand mixer. Add in the Water/Yeast/Salt mixture and stir with a spatula until just combined. "
						+ "Then, mix on low for 3-5 minutes, or until the dough is uniform and smooth. Let rest for 20-30 minutes.",
					pt3: "3. After resting, mix dough on low again for 30 seconds. Then, lightly oil another large bowl and transfer the dough ball. "
						+ "Cover with a lid or plastic wrap and let proof for 2 hours at room temperature.",
					pt4: "4. Turn out dough onto surface. Cut and shape into equal sized balls and place into a large tupperware or "
						+ "on individual dinner plates. Cover and place in refrigerator for 12-24 hours.",
					pt5: "5. Remove dough from refrigerator 30-60 minutes before making pizza. Then stretch, top, and bake!"
				});
				recalcIngredients();
			}
		});
	}

	function routeToPrint() {
		if (recipeEdit || addMode) {
			Swal.fire({
				title: "Edits In Progress",
				icon: 'question',
				text: "Edits are currently being made. If you navigate to print preview, these changes will be lost. Would you like to continue?",
				showCancelButton: true,
				confirmButtonText: "Yes",
				cancelButtonText: "No"
			}).then((result) => {
				if (result.isConfirmed) {
					if (recipeEdit) {
						recipeW.set({
							pt1: preEdit.pt1,
							pt2: preEdit.pt2,
							pt3: preEdit.pt3,
							pt4: preEdit.pt4,
							pt5: preEdit.pt5,
						});
					}
					goto('/print');
				}
			})
		} else {
			goto('/print');
		}
	}

	let addMode = false;
	let newIngredientName = null;
	let newIngredientMeasurement = null;
	function setAddMode() {
		newIngredientName = null;
		newIngredientMeasurement = null;
		addMode = !addMode;
	}

	function saveIngredient(name, measurement) {
		if (!name) {
			Swal.fire({
				title: "Add Ingredient Error",
				icon: 'warning',
				text: "Ingredient name must not be empty"
			});
			return
		}
		if (measurement <= 0) {
			Swal.fire({
				title: "Add Ingredient Error",
				icon: 'warning',
				text: "Ingredient measurement must be greater than zero"
			});
			return
		}

		ingredients[name] = {base: measurement / servings, measurement: measurement, percentage: measurement / ingredients.Flour.measurement};
		addMode = !addMode;
		newIngredientName = null;
		newIngredientMeasurement = null;

		Swal.fire({
				title: "Success!",
				icon: 'success',
				text: "Ingredient: " + name + " was added."
			});
	}

	function exitAddMode() {
		Swal.fire({
				title: "Cancel Add Ingredient",
				icon: 'question',
				text: "The current ingredient will not be added. Would you like to continue?",
				showCancelButton: true,
				cancelButtonText: "No",
				confirmButtonText: "Yes",
			}).then((result) => {
				if (result.isConfirmed) {
					addMode = !addMode;
					newIngredientName = null;
					newIngredientMeasurement = null;
				}
			})
	}

	function dismissWelcome() {
		showWelcomeMessageW.update(value => !value);
		// showWelcomeMessage = false;
	}

	function toggleTooltipMode() {
		tooltipModeW.update(value => !value);
		// showWelcomeMessage = false;
	}

	function toggleAdvancedMode() {
		advancedModeW.update(value => !value);
		// showWelcomeMessage = false;
	}

</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<div class="container">
	<h1 class="widthAll centerText marginAuto title">Pizza Dough Planner</h1>
	{#if showWelcomeMessage}
		<div class="row spaceEvenly">
			<div class="marginBottom">
				<b>Welcome to Pizza Dough Planner v1.0!</b><br>
				This is the official first release of the application. Bugs are expected—don't let them keep you from exploring!
				Pizza dough calculations are made based on number of servings, which can be adjusted with the up/down arrows below.
				Options are available, but some are either not implemented or incomplete, so please approach with an open mind.
				Please send comments, questions, or concerns: <a href="mailto:hoffr@oregonstate.edu">hoffr@oregonstate.edu</a>. Thanks for using Pizza Dough Planner!
			</div>
			<div class="tooltipArrowAbove">
				<button class="transparentButton icon red" on:click={dismissWelcome}><FaTimes /></button>
				{#if !tooltipMode}
					<div class="tooltiptextArrowAbove">
						Dismiss this message.
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<hr>
	<div class="row center">
		<label for="servings">How many pizzas would you like to prepare dough for?</label>
		<input id="servings" type="number" class="servings" readonly bind:value={servings} />
		<div class="column">
			<div class="tooltipArrowAbove">
				<button class="transparentButton icon" on:click={incServings}><FaChevronUp /></button>
				{#if !tooltipMode}
					<div class="tooltiptextArrowAbove">
						Increase the number of pizzas created by this recipe by one.
					</div>
				{/if}
			</div>
			<div class="tooltipArrowBelow">
				<button class="transparentButton icon" on:click={decServings}><FaChevronDown /></button>
				{#if !tooltipMode}
					<div class="tooltiptextArrowBelow">
						Decrease the number of pizzas created by this recipe by one.
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="row spaceEvenly ingOpContainer">
		<div class="column ingredientsContainer">
			<h3 class="centerText setMargin">Ingredient Summary</h3>
			<div class="row spaceBetween">
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
						{#if advancedMode}
							<div class="column">
								{#each Object.entries(ingredients) as [name, details]}
									{#if name === "Flour"}
										<div class="row"><br></div>
									{/if}
									{#if name !== "Flour"}
										<div class="row">
											<div class="tooltipArrowAbove">
												<button class="transparentButton iconSmall" on:click={() => decIngredientPercentage(name)}><FaChevronLeft /></button>
												{#if !tooltipMode}
													<div class="tooltiptextArrowAbove">
														Decrease {name} by {details.percentage > .05 ? "1%" : "0.1%"}.
													</div>
												{/if}
											</div>
										</div>
									{/if}
								{/each}
						</div>
						{/if}
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
						{#if advancedMode}
						<div class="column">
							{#each Object.entries(ingredients) as [name, details]}
								{#if name === "Flour"}
									<div class="row"><br></div>
								{/if}
								{#if name !== "Flour"}
									<div class="row">
										<div class="row">
											<div class="tooltipArrowAbove">
												<button class="transparentButton iconSmall" on:click={() => incIngredientPercentage(name)}><FaChevronRight /></button>
												{#if !tooltipMode}
													<div class="tooltiptextArrowAbove">
														Increase {name} by {details.percentage > .05 ? "1%" : "0.1%"}.
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/if}
							{/each}
						</div>
						{/if}
					</div>
				</div>
				<div class="column"></div>
			</div>
			{#if advancedMode}
				{#if addMode}
				<br>
					<div class="spaceBetween recipeEdit">
						<div class="row spaceBetween">
							<div class="tooltip">
								<b>Add New Ingredient</b>
								{#if !tooltipMode}
									<div class="tooltiptext">
										<u>Add New Ingredient</u><br>
										To add a new ingredient, fill out the name and measurement inputs below.
									</div>
								{/if}
							</div>
							<div>
								<div class="tooltipArrowAbove">
									<button class="transparentButton icon" on:click={() => saveIngredient(newIngredientName, newIngredientMeasurement)}><FaSave /></button>
									{#if !tooltipMode}
										<div class="tooltiptextArrowAbove">
											<u>Save Ingredient</u><br>
											Click to save the new ingredient.
										</div>
									{/if}
								</div>
								<div class="tooltipArrowAbove">
									<button class="transparentButton icon red" on:click={exitAddMode}><FaRegWindowClose /></button>
									{#if !tooltipMode}
										<div class="tooltiptextArrowAbove">
											<u>Cancel</u><br>
											Click to cancel adding a new ingredient.
										</div>
									{/if}
								</div>
							</div>
						</div>
						<div class="row spaceEvenly">
							<div class="column widthAll spaceBetween">
								<label for="ingredientName">Ingredient name:</label>
								<label for="ingredientMeasurement">Measurement:</label>
							</div>
							<div class="column widthAll spaceBetween">
								<input id="ingredientName" type="text" placeholder="Ex: Honey" bind:value={newIngredientName}>
								<input id="ingredientName" type="number" min=0.1 placeholder="in grams" bind:value={newIngredientMeasurement}>
							</div>
						</div>
					</div>
				{/if}
				{#if !addMode}
					<div class="tooltipSmall">
						<div class="row center addIngredient"><button class="transparentButton icon green" on:click={setAddMode}><FaPlus /></button>&nbsp;&nbsp;Add Ingredient</div>
						{#if !tooltipMode}
							<div class="tooltiptextSmall">
								<u>Add Ingredient</u><br>
								Click + to add a new ingredient.
							</div>
						{/if}
					</div>
				{/if}
				<br>
				<div class="centerText lightText">Unsure on how modifying ingredients will affect your dough? <a target="_blank" href="http://www.thehomepizzeria.com/pizza-dough/ingredients/#">Read more here</a></div>
			{/if}
		</div>
		<div class="column optionsContainer">
			<h3 class="centerText setMargin">Options</h3>
			<div class="column options">
				<div class="row spaceEvenly options">
					<div class="marginAuto">
						<br>
						<div class="tooltip centerText">
							<div>Disable tooltips:</div>
							{#if !tooltipMode}
								<div class="tooltiptext">
									<u>Disable tooltips</u><br>
									Already know your way around the application? Disable tooltips by checking this option.
								</div>
							{/if}
						</div>
						<div class="{tooltipMode? "sliderOff": "sliderOn"} marginAuto">
							<button class="{tooltipMode? "sliderActive": "sliderNotActive"}" on:click={toggleTooltipMode}>{tooltipMode? "ON": "OFF"}</button>
						</div>
						<br>
					</div>
					<div class="marginAuto">
						<br>
						<div class="tooltip centerText">
							<div>Pizzaiolo Mode:</div>
							{#if !tooltipMode}
								<div class="tooltiptext">
									<u>Pizzaiolo Mode</u><br>
									An advanced mode intended for dough enthusiasts looking to change up and/or refine their recipe to achieve
									that perfect pie. If this sounds like too much, don't worry; our base recipe will still impress your friends and family!
								</div>
							{/if}
						</div>
						<div class="{advancedMode? "sliderOff": "sliderOn"} marginAuto">
							<button class="{advancedMode? "sliderActive": "sliderNotActive"}" on:click={toggleAdvancedMode}>{advancedMode? "ON": "OFF"}</button>
						</div>
						<br>
					</div>
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
			{#if advancedMode}
				{#if !recipeEdit}
					<div class="tooltipArrowAbove">
						<button class="transparentButton icon" on:click={setRecipeEdit}><FaEdit /></button>
						{#if !tooltipMode}
							<div class="tooltiptextArrowAbove">
								<u>Edit Instructions</u><br>
								Make changes to the recipe instructions.
							</div>
						{/if}
					</div>
				{/if}
				{#if recipeEdit}
					<div>
						<div class="tooltipArrowAbove">
							<button class="transparentButton icon" on:click={saveRecipeEdit}><FaSave /></button>
							{#if !tooltipMode}
								<div class="tooltiptextArrowAbove">
									<u>Save Instructions</u><br>
									Save edits made to the instructions.
								</div>
							{/if}
						</div>
						<div class="tooltipArrowAbove">
							<button class="transparentButton icon red" on:click={exitRecipeEdit}><FaRegWindowClose /></button>
							{#if !tooltipMode}
								<div class="tooltiptextArrowAbove">
									<u>Cancel Instruction Edit</u><br>
									Click to cancel editing recipe.
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
		{#if recipeEdit}
			<div class="column recipeEdit">
				<div contenteditable="true" bind:innerHTML={recipe.pt1}></div><br>
				<div contenteditable="true" bind:innerHTML={recipe.pt2}></div><br>
				<div contenteditable="true" bind:innerHTML={recipe.pt3}></div><br>
				<div contenteditable="true" bind:innerHTML={recipe.pt4}></div><br>
				<div contenteditable="true" bind:innerHTML={recipe.pt5}></div>
			</div>
		{/if}
		{#if !recipeEdit}
			<div class="column recipe">
				<div>{recipe.pt1}<br><br></div>
				<div>{recipe.pt2}<br><br></div>
				<div>{recipe.pt3}<br><br></div>
				<div>{recipe.pt4}<br><br></div>
				<div>{recipe.pt5}</div>
			</div>
		{/if}
	</div>
	<br>
	<div class="row">
		<div class="widthAll centerText">
			<div class="tooltip">
				<button class="styledButton" on:click={resetDefaultValues}>Reset to Default</button>
				{#if !tooltipMode}
					<div class="tooltiptext">
						<u>Reset to Default</u><br>
						Reset all ingredients, measurements, and percentages to their default values.
					</div>
				{/if}
			</div>
		</div>
		<div class="widthAll centerText">
			<div class="tooltip">
				<button class="styledButton" on:click={routeToPrint}>Print Preview</button>
				{#if !tooltipMode}
					<div class="tooltiptext">
						<u>Print Preview</u><br>
						Prepare a neatly formatted document with all ingredient measurements and instructions.
					</div>
				{/if}
			</div>
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
	.ingOpContainer {
		flex-wrap: wrap;
		width: 100%;
	}
	.ingredientsContainer {
		flex-shrink: 1;
		flex-grow: 1;
		min-width: 45%;
		padding-left: 2.5%;
		padding-right: 2.5%;
	}
	.optionsContainer {
		flex-shrink: 1;
		flex-grow: 1;
		min-width: 45%;
		padding-left: 2.5%;
		padding-right: 2.5%;
	}
	.addIngredient {
		padding-top: 1em;
	}
	.options {
		background-color: #EEEEEE;
		border-radius: 12px;
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
		max-width: 80%;
	}
	.center {
		align-items: center;
		justify-content: center;
	}
	.alignCenter {
		align-items: center;
	}
	.widthAll {
		width: 100%;
	}
	.title {
		padding-top: .5em;
		padding-bottom: .5em;
	}
	.marginAuto {
		margin: auto;
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
	.recipe {
		border: 1px ;
		border-style: solid;
		border-color: transparent;
		padding: .25em;
	}
	.recipeEdit {
		border: 1px ;
		border-style: solid;
		background-color: #E8EAF6;
		border-color: #757575;
		border-radius: 6px;
		padding: .25em;
	}
	.red {
		color: #F44336;
	}
	.green {
		color: #4CAF50;
	}
	.icon {
		width: 20px;
		height: 20px;
		padding: 0;
	}
	.icon:hover {
		/* box-shadow: 0 0.2em 0.2em -0.2em var(--hover); */
		transform: translateY(-0.1em);
	}
	.iconSmall {
		width: 12px;
		height: 12px;
		padding: 0;
	}
	.iconSmall:hover {
		transform: translateY(-0.1em);
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
	.sliderActive {
		font-weight: bold;
		background-color: white;
		border-color: #283593;
		border-radius: 12px;
	}
	.sliderNotActive {
		font-weight: bold;
		color: #757575;
		background-color: white;
		border-color: #BDBDBD;
		border-radius: 12px;
	}
	.servings {
		border: none;
		font-size: x-large;
		width: 2em;
		text-align: center; 
	}
	input {
		width: 90%;
		border: none;
		border-bottom: 1px solid #BDBDBD;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.styledButton {
		width: 10em;
		border: 0;
		background-color: #303F9F;
		color: white;
        border-radius: 6px;
        padding: 8px 12px;
        font-weight: bold;
	}
	.styledButton:hover {
		background-color: #283593;
		-webkit-box-shadow: 0px 0px 10px 5px rgba(61,61,61,0.3); 
		box-shadow: 0px 0px 10px 5px rgba(61,61,61,0.3);
	}
	.styledButton:active {
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
		width: 500%;
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