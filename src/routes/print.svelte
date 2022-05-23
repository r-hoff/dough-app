<script>
	import Swal from 'sweetalert2/dist/sweetalert2.js';
	import 'sweetalert2/src/sweetalert2.scss';
	import { goto } from '$app/navigation';
    import { ingredientsW, servingsW, recipeW, tooltipModeW, recipeTitleW,
		 mobileW, pizzaSizeW, showImageW, imgSrcW, imageArrayW } from './stores';
	import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
	import FaPrint from 'svelte-icons/fa/FaPrint.svelte'
	import FaEdit from 'svelte-icons/fa/FaEdit.svelte'
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
	import numToWords from 'number-to-words/src/index.js';
	const { toWords } = numToWords;
	
	import axios from 'axios';

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

	let showImage;
	showImageW.subscribe(value => {
		showImage = value;
	});

	let imgSrc;
	imgSrcW.subscribe(value => {
		imgSrc = value;
	});

	let imageArray;
	imageArrayW.subscribe(value => {
		imageArray = value;
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
			showCloseButton: true,
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

	function addImage() {
		Swal.fire({
			title: "Add Image",
			text: "Search for an image to add to recipe:",
			input: "text",
			showCloseButton: true,
			confirmButtonText: "Search"
		}).then((search) => {
			if (search.isConfirmed) {
				if (search.value !== '') {
					axios({
						method: 'get',
						headers: {
							'Authorization': `Client-ID ${import.meta.env.VITE_UNSPLASH_TOKEN}`
						},
						url: `https://api.unsplash.com/search/photos?query=${search.value}`
					}).then((response) => {
						let images = [];
						for (const result of response.data.results) {
							images.push(result.urls.thumb)
						}
						imageArrayW.set(images);
						goto("/images");
					})

					// for cs361 teammate integration
					// axios({
					// 	method: 'get',
					// 	url: `http://127.0.0.1:5000/imageService/${search.value}`
					// }).then((response) => {
					// 	imageArrayW.set(response.data);
					// 	goto("/images");
					// })

				} else {
					Swal.fire({
						title: "Error",
						text: "Search keyword must not be empty, please try again.",
						showCloseButton: true,
						confirmButtonText: "Retry"
					}).then((retry) => {
						if (retry.isConfirmed) {
							addImage()
						}
					})
				}
			}
		})
	}

	function editImage() {
		Swal.fire({
			title: "Edit Image",
			text: "Would you like to delete the image or start a new search?",
			showCancelButton: true,
			showCloseButton: true,
			confirmButtonText: "Delete",
			cancelButtonText: "New Search"
		}).then((choice) => {
			if (choice.isConfirmed) {
				imgSrcW.set("");
				showImageW.set(false)
			}
			if (choice.dismiss === "cancel") {
				addImage();
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
	<div id="hide" class="navbar spaceBetween">
		<div class="navbarContainer spaceBetween">
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
			<div class="row center servings">Makes {toWords(servings)} {pizzaSize}" pizzas.</div>
			<div class="row center servings">(~{Math.round(calcTotal()/servings)}g dough balls)</div>
		{/if}
		{#if servings === 1}
			<div class="row center servings">Makes {toWords(servings)} {pizzaSize}" pizza.</div>
		{/if}
		<div class="addImage">
			{#if !showImage}
				<div id="addImage" class="row center">
					<div class="tooltipArrowBelow">
						<button class="transparentButton iconLarge green" on:click={addImage}><FaPlus /></button>
						{#if !tooltipMode}
							<div id="ttBack" class="tooltiptextArrowBelow">
								Add image to recipe.
							</div>
						{/if}
					</div>
					<div>Add Image</div>
				</div>
			{/if}
			{#if showImage}
				<div class="row center">
					<img src={imgSrc} alt="searchImage" on:click={editImage}>
				</div>
			{/if}
		</div>
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
		#pad1, #pad2 {
			padding: 0;
		}
		#hide, #addImage, #ttPrint, #ttPrint, #ttEdit {
			visibility: hidden;
			height: 0;
		}
		#print {
			height:100%; 
			font-size: 18pt;
		}
	}
	h4 {
		margin-top: 1rem;
		margin-bottom: 1rem;
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
	.centerText {
		text-align: center;
	}
	.setMargin {
		margin: .5em;
	}
	.addImage {
		margin-top: .5em;
	}
	.center {
		align-items: center;
		justify-content: center;
	}
	.widthAll {
		width: 100%;
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
	.iconLarge {
		width: 36px;
		height: 36px;
	}
	.iconLarge:hover {
		transform: translateY(-0.1em);
	}
	button {
		cursor: pointer;
	}
	.transparentButton {
		border: none;
		background-color: transparent;
	}
	.servings {
		border: none;
		font-size: 1.25em;
		text-align: center; 
	}
	.green {
		color: #4CAF50;
	}

	/* tooltip related */
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
</style>