<script lang="ts">
	let isCollapsedButtonClicked: boolean = false;

	const toggleCollapsedButton = () => {
		isCollapsedButtonClicked = !isCollapsedButtonClicked;
	};
</script>

<nav class="navbar-container maroon">
	<div class="navbar-row">
		<a href="/" class="logo-container">
			<img src="logo.png" class="h-11" alt="RMD Logo" />
			<span class="nav-title">RateMyDine</span>
		</a>
		<button type="button" class="collpase-btn" on:click={toggleCollapsedButton}>
			<span class="sr-only">Open main menu</span>
			<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 1h15M1 7h15M1 13h15"
				/>
			</svg>
		</button>
		<div class="w-full md:block md:w-auto" class:hidden={isCollapsedButtonClicked}>
			<ul class="nav-list">
				<li>
					<a href="/" class="nav-btn maroon">Log in</a>
				</li>
				<li>
					<a href="/" class="nav-btn maroon">Sign up</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style lang="postcss">
	.navbar-container {
		@apply border-gray-200 bg-gray-50 dark:bg-gray-800;
	}

	.maroon {
		background-color: maroon;
	}

	.navbar-row {
		@apply mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4;
	}

	.logo-container {
		@apply flex items-center rtl:space-x-reverse;
	}

	.nav-list {
		@apply mt-4 flex flex-col rounded-lg bg-gray-50 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-transparent;
	}

	.nav-title {
		@apply self-center whitespace-nowrap text-2xl font-semibold text-white;
	}

	.nav-btn {
		@apply block px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent
		 md:hover:text-blue-700 dark:border-gray-700 dark:text-white 
		 dark:hover:bg-gray-400 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500;
	}

	.collpase-btn {
		@apply inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600;
	}
</style>
