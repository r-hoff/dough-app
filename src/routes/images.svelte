<script>
	import { goto } from '$app/navigation';
    import { imgSrcW, imageArrayW, mobileW, showImageW, tooltipModeW } from './stores';
    import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
    import Swal from 'sweetalert2/dist/sweetalert2.js';
	import 'sweetalert2/src/sweetalert2.scss';

    let mobile;
	mobileW.subscribe(value => {
		mobile = value;
	});

    let tooltipMode;
	tooltipModeW.subscribe(value => {
		tooltipMode = value;
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

    function selectImage(url) {
        Swal.fire({
			title: "Select Image",
            text: "Would you like to use this image?",
			showCancelButton: true,
			cancelButtonText: "No",
			confirmButtonText: "Yes"
		}).then((selection) => {
            if (selection.isConfirmed) {
                imgSrcW.set(url);
                showImageW.set(true);

                goto("/print");

                Toast.fire({
					icon: 'success',
					title: 'Image updated'
				})
            }
        })
    }

    function routeBack() {
        goto("/print")
    }

</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<div>
    <div class="navbar">
		<div class="navbarContainer">
			<div class="tooltipArrowBelow">
				<button class="transparentButton iconLarge" on:click={routeBack}><FaArrowLeft /></button>
				{#if !tooltipMode}
					<div id="ttBack" class="tooltiptextArrowBelow">
						Navigate back to print preview.
					</div>
				{/if}
			</div>
		</div>
		<hr class="hrNav">
	</div>
    <br>
    <div class="centerText">Select an image to add</div><br>
    {#each imageArray as image, i}
        <img class="center" src={image} alt={"image" + i} on:click={() => selectImage(image)}>
        <br>
    {/each}
</div>
<style>
    * {
		font-family: 'Quicksand', sans-serif;
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
        align-items: center;
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
    .transparentButton {
		border: none;
		background-color: transparent;
	}
    .iconLarge {
		width: 36px;
		height: 36px;
	}
	.iconLarge:hover {
		transform: translateY(-0.1em);
	}
    .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }
    .centerText {
		text-align: center;
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