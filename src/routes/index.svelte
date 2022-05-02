<script>
	import Swal from 'sweetalert2';
	import 'sweetalert2/src/sweetalert2.scss';
	import { goto } from '$app/navigation';
	import { ingredientsW, servingsW, recipeW, tooltipModeW, advancedModeW,
		 showWelcomeMessageW, pizzaSizeW, lastSelectionW, mobileW } from './stores';
	import FaChevronUp from 'svelte-icons/fa/FaChevronUp.svelte'
	import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'
	import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte'
	import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte'
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
	import FaEdit from 'svelte-icons/fa/FaEdit.svelte'
	import FaBan from 'svelte-icons/fa/FaBan.svelte'
	import FaTimes from 'svelte-icons/fa/FaTimes.svelte'

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

	let pizzaSize;
	pizzaSizeW.subscribe(value => {
		pizzaSize = value;
	});

	let lastSelection;
	lastSelectionW.subscribe(value => {
		lastSelection = value;
	});

	let mobile;
	mobileW.subscribe(value => {
		mobile = value;
	});

	function incServings() {
		servingsW.update(value => value + 1);

		recalcIngredients();
	}

	function decServings() {
		if (servings > 1) {
			servingsW.update(value => value - 1);

			recalcIngredients();
		} else {
			Toast.fire({
				icon: 'warning',
				title: 'Minimum number of pizzas is 1'
			})
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
		let increment = 0.001;

		if (ingredients[ingredient].percentage - 0.01 >= .05) {
			increment = 0.01;
		}
		// only change the percentage if it stays at or above 0%
		if (+((ingredients[ingredient].percentage - increment).toFixed(3)) >= 0) {
			ingredients[ingredient].percentage -= increment;
			recalcIngredients();
		}
	}

	function incIngredientPercentage(ingredient) {
		let increment = 0.001;

		if (ingredients[ingredient].percentage >= .05) {
			increment = 0.01;
		}
		// only change the percentage if it stays at or below 100%
		if (+((ingredients[ingredient].percentage + increment).toFixed(3)) <= 1) {
			ingredients[ingredient].percentage += increment;
			recalcIngredients();
		}
	}

	function recipeString() {
		let recipeString = '';
		let length = recipe.length - 1;
		let idx = 0;
		for (const step of recipe) {
			if (idx === length) {
				recipeString += step;
			} else {
				recipeString += step + "\n\n";
			}
			idx++;
		}
		return recipeString;
	}
	
	function editInstructions() {
		let preEdit = recipeString();
		Swal.fire({
			title: "Edit Instructions",
			text: "Enter instructions below",
			input: "textarea",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			confirmButtonText: "Save",
			inputValue: preEdit
		}).then((edit) => {
			if (edit.isConfirmed) {
				if (edit.value !== preEdit) {
					saveRecipeEdit(edit.value);
				}
			}
		})
	}

	function saveRecipeEdit(edit) {
		let edits = edit.split("\n\n");
		if (edits.length <= 1) {
			recipeW.set([])
		} else {
			recipeW.set(edits)
		}
		Toast.fire({
			icon: 'success',
			title: 'Instructions updated'
		})
	}

	function resetDefaultValues() {
		Swal.fire({
				title: "Reset to Default",
				icon: 'warning',
				text: "All ingredients, percentages, servings, pizza size, and recipe content will be reset. Would you like to continue?",
				showCancelButton: true,
				confirmButtonText: "Yes",
				cancelButtonText: "No"
		}).then((result) => {
			if (result.isConfirmed) {
				Toast.fire({
					icon: 'success',
					title: `Default values were restored successfully!`
				})
				servingsW.set(1);
				ingredientsW.set({
					Flour: {base: 250, measurement: 250, percentage: 1, default: true},
					Water: {base: 175, measurement: 175, percentage: .7, default: true},
					Yeast: {base: 0.5, measurement: 0.5, percentage: .002, default: true},
					Salt: {base: 6, measurement: 6, percentage: .024, default: true},
				});
				recipeW.set([
					"Heat water to ~100°F (38°C). Dissolve salt in water, then stir in yeast. Let sit for a minute or two.",
					"Measure flour into bowl of stand mixer. Add in the water/yeast/salt mixture and stir with a spatula until just combined. "
					+ "Then, mix on low for 2-3 minutes, or until the dough is uniform and smooth. Let rest for 20-30 minutes.",
					"After resting, mix dough on low again for 30 seconds. Then, lightly oil another large bowl and transfer the dough ball. "
					+ "Cover with a lid or plastic wrap and let proof for 1-2 hours at room temperature.",
					"Turn out dough onto surface. Cut and shape into equal sized balls and place into a large tupperware or "
					+ "on individual dinner plates. Cover and place in refrigerator for 12-24 hours.",
					"Remove dough from refrigerator 30-60 minutes before making pizza. Then stretch, top, and bake!"
				]);
				lastSelectionW.set(16);
				pizzaSizeW.set(16);
				recalcIngredients();
			}
		});
	}

	function routeToPrint() {
		goto('/print');
	}

	function addIngredient() {
		Swal.fire({
			title: "Add Ingredient",
			inputLabel: "Enter ingredient name:",
			input: "text",
			inputPlaceholder: 'Ex: Honey',
			inputAttributes: {
				autocapitalize: 'on'
			},
			showCloseButton: true,
			confirmButtonText: "Continue",
			inputValidator: (name) => {
				if (!name) {
				return 'Please enter an ingredient name'
				}
			}
		}).then((name) => {
			if(name.isConfirmed) {
				Swal.fire({
					title: "Add Ingredient",
					inputLabel: "Enter ingredient measurement:",
					input: "number",
					inputPlaceholder: 'in grams',
					showCloseButton: true,
					confirmButtonText: "Add",
					inputValidator: (measurement) => {
						if (measurement <= 0) {
						return 'Measurement must be greater than zero'
						}
					}
				}).then((measurement) => {
					if (measurement.isDismissed) {
						Toast.fire({
							icon: 'error',
							title: `Cancelled adding ingedient: ${name.value}`
						})
					}
					if(measurement.isConfirmed) {
						ingredients[name.value] = {base: measurement.value / servings, measurement: parseInt(measurement.value), percentage: measurement.value / ingredients.Flour.measurement, default: false};
						Toast.fire({
							icon: 'success',
							title: `${name.value} was added successfully!`
						})
					}
				})
			}
		})
	}

	function deleteIngredient(ingredient) {
		Swal.fire({
			title: `Delete ${ingredient}`,
			text: `${ingredient} will be removed. Do you wish to proceed?`,
			showCancelButton: true,
			confirmButtonText: "Yes",
			cancelButtonText: "No"
		}).then((value) => {
			if (value.isConfirmed) {
				// delete ingredient and update ingredients
				delete ingredients[ingredient];
				ingredientsW.set(ingredients);

				Toast.fire({
					icon: "success",
					title: `Deleted ${ingredient} from ingredients`
				})
			}
		})
	}

	let Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 2000
	})

	let ToastCountdown = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: true,
		confirmButtonText: "Undo",
		showCancelButton: true,
		cancelButtonText: "Dismiss",
		timer: 2000,
		timerProgressBar: true,
		reverseButtons: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})

	function testScreen() {
		if (window.matchMedia("only screen and (max-width: 760px)").matches) {
			mobileW.set(true)
			tooltipModeW.set(true);

			Toast = Swal.mixin({
				toast: true,
				position: 'top',
				showConfirmButton: false,
				timer: 2000
			})

			ToastCountdown = Swal.mixin({
				toast: true,
				position: 'top',
				showConfirmButton: true,
				confirmButtonText: "Undo",
				showCancelButton: true,
				cancelButtonText: "Dismiss",
				timer: 2000,
				timerProgressBar: true,
				reverseButtons: true,
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer)
					toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			})
		}
	}


	function dismissWelcome() {
		testScreen();
		showWelcomeMessageW.update(value => !value);
		ToastCountdown.fire({
			icon: 'info',
			title: 'Thanks for using Dough Planner!'
		}).then((result) => {
			if (result.isConfirmed) {
				showWelcomeMessageW.update(value => !value);
			}
		})
	}

	function toggleTooltipMode() {
		if (mobile) {
			Toast.fire({
				icon: 'info',
				title: 'Tooltips only available on desktop'
			})
		} else {
			if (tooltipMode) {
				tooltipModeW.update(value => !value);
				Toast.fire({
					icon: 'info',
					title: 'Tooltips enabled'
				});
			} else {
				tooltipModeW.update(value => !value);
				Toast.fire({
					icon: 'info',
					title: 'Tooltips disabled'
				});
			}
			
		}
	}

	function toggleAdvancedMode() {
		if (advancedMode) {
			advancedModeW.update(value => !value);
			Toast.fire({
				icon: 'info',
				title: 'Pizzaiolo Mode disabled'
			});
		} else {
			advancedModeW.update(value => !value);
			Toast.fire({
				icon: 'info',
				title: 'Pizzaiolo Mode enabled'
			});
		}
	}

	function scaleIngredients(size) {
		pizzaSizeW.set(size);

		let oldArea = Math.pow(lastSelection / 2, 2) * Math.PI;
		let newArea = Math.pow(pizzaSize / 2, 2) * Math.PI;
		let modifier = newArea / oldArea;

		const ingredientList = Object.keys(ingredients);
		for (const ingredient of ingredientList) {
			ingredients[ingredient].base *= modifier;
		}

		recalcIngredients();
		lastSelectionW.set(size);
	}

	function roundQtr(num) {
		return Math.round(num*4)/4;
	}

</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<svelte:window on:pointermove|once={testScreen}/>
<div class="container">
	<h1 class="widthAll centerText marginAuto title">Pizza Dough Planner</h1>
	{#if showWelcomeMessage}
		<div class="row spaceEvenly">
			<div class="marginBottom">
				<b>Welcome to Pizza Dough Planner v2.0!</b><br>
				This is the second official release of the application. All features are now implemented! Pizzaiolo Mode, ingredient
				adjustment/addition/deletion, and print preview are all available. Pizza dough calculations are made based on number 
				of servings, which can be adjusted with the up/down arrows below. If bugs are encountered, please report
				<a href="mailto:hoffr@oregonstate.edu">with this link</a>. Thanks for using Pizza Dough Planner!
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
	<div class="row center pizzaSize">
		<div>Pizza Size:</div>
		<div>
			<label for="small">&nbsp;&nbsp;&nbsp;12"</label>
			<input bind:group={pizzaSize} type="radio" name="pizzaSize" value={12} on:change={() => scaleIngredients(12)}>
		</div>
		<div>
			<label for="small">&nbsp;&nbsp;&nbsp;14"</label>
			<input bind:group={pizzaSize} type="radio" name="pizzaSize" value={14} on:change={() => scaleIngredients(14)}>
		</div>
		<div>
			<label for="small">&nbsp;&nbsp;&nbsp;16"</label>
			<input bind:group={pizzaSize} type="radio" name="pizzaSize" value={16} on:change={() => scaleIngredients(16)}>
		</div>
	</div>
	<div class="row spaceEvenly ingOpContainer">
		<div class="column ingredientsContainer">
			<h3 class="centerText setMargin">Ingredient Summary</h3>
			<div class="row spaceBetween">
				<div class="column"></div>
				<div class="column centerText">
					<u>Ingredient</u>
					{#each Object.entries(ingredients) as [name, details]}
						<div class="row center">
							{#if advancedMode}
								{#if !details.default}
									<div class="tooltipArrowAbove">
										<button class="transparentButton iconMed red" on:click={() =>deleteIngredient(name)}><FaBan /></button>
										{#if !tooltipMode}
											<div class="tooltiptextArrowAbove">
												Remove {name}
											</div>
										{/if}
									</div>
									<div>&nbsp;</div>
								{/if}
							{/if}
							<div>{name}</div>
						</div>
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
								{#if (+(details.percentage * 100).toFixed(2) - Math.round(details.percentage * 100)) !== 0}
									<div>{(details.percentage * 100).toFixed(1)} %</div>
								{/if}
								{#if (+(details.percentage * 100).toFixed(2) - Math.round(details.percentage * 100)) === 0}
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
				<div class="row center addIngredient">
					<div class="tooltipArrowAbove">
						<button class="transparentButton icon green" on:click={addIngredient}><FaPlus /></button>
						{#if !tooltipMode}
							<div class="tooltiptextArrowAbove">
								<u>Add Ingredient</u><br>
								Click + to add a new ingredient.
							</div>
						{/if}
					</div>
					&nbsp;&nbsp;Add Ingredient
				</div>
				<br>
				<div class="centerText lightText">Unsure on how modifying ingredients will affect your dough? <a target="_blank" href="http://www.thehomepizzeria.com/pizza-dough/ingredients/#">Read more here</a></div>
			{/if}
		</div>
		<div class="column optionsContainer">
			<h3 class="centerText setMargin">Options</h3>
			<div class="column options">
				<div class="row spaceEvenly options">
					<div class="marginAuto">
						<div class="tooltip centerText">
							<div>Disable tooltips:</div>
							{#if !tooltipMode}
								<div class="tooltiptext">
									<u>Disable tooltips</u><br>
									Already know your way around the application? Disable tooltips by checking this option.
								</div>
							{/if}
						</div>
						<div class="{tooltipMode? "sliderOn": "sliderOff"} marginAuto">
							<button class="{tooltipMode? "sliderActive": "sliderNotActive"}" on:click={toggleTooltipMode}>&nbsp;&nbsp;</button>
						</div>
					</div>
					<div class="marginAuto">
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
						<div class="{advancedMode? "sliderOn": "sliderOff"} marginAuto">
							<button class="{advancedMode? "sliderActive": "sliderNotActive"}" on:click={toggleAdvancedMode}>&nbsp;&nbsp;</button>
						</div>
					</div>
				</div>
			</div>
			<div class="centerText lightText">Activate Pizzaiolo Mode to fine tune your recipe!</div>
		</div>
	</div>
	<br>
	<hr>
	<div class="column">
		<div class="row spaceBetween">
			<h4>Step-by-step Pizza Dough Instructions:</h4>
			{#if advancedMode}
				<div class="tooltipArrowAbove">
					<button class="transparentButton icon" on:click={editInstructions}><FaEdit /></button>
					{#if !tooltipMode}
						<div class="tooltiptextArrowAbove">
							<u>Edit Instructions</u><br>
							Make changes to the recipe instructions.
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="column recipe">
			{#each recipe as step, i}
				<div>{i+1}. {step}<br><br></div>
			{/each}
		</div>
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
		width: 90%;
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
		padding-top: .4rem;
		padding-bottom: .4rem;
	}
	.pizzaSize {
		padding-top: .5rem;
		padding-bottom: .5rem;
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
		font-size: 2.5vmax;
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
		transform: translateY(-0.1em);
	}
	.iconMed {
		width: 16px;
		height: 16px;
		padding: 0;
	}
	.iconMed:hover {
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
	.sliderOn {
		width: 2.5rem;
		text-align: right;
		background-color: #00BCD4;
		border-radius: 12px;
	}
	.sliderOff {
		width: 2.5rem;
		text-align: left;
		background-color: #BDBDBD;
		border-radius: 12px;
	}
	.sliderActive {
		background-color: white;
		border-radius: 12px;
		border: none;
		border: 2px solid #00BCD4;
	}
	.sliderNotActive {
		color: #757575;
		background-color: white;
		border-radius: 12px;
		border: 2px solid #BDBDBD;
	}
	.servings {
		border: none;
		font-size: x-large;
		width: 2em;
		text-align: center; 
	}
	.styledButton {
		width: 10em;
		border: 0;
		background-color: #0097A7;
		color: white;
        border-radius: 6px;
        padding: 8px 12px;
        font-weight: bold;
	}
	.styledButton:hover {
		background-color: #00838F;
		-webkit-box-shadow: 0px 0px 10px 5px rgba(61,61,61,0.3); 
		box-shadow: 0px 0px 10px 5px rgba(61,61,61,0.3);
	}
	.styledButton:active {
		background-color: #006064;
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
		background-color: #616161;
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
		background-color: #616161;
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
		background-color: #616161;
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