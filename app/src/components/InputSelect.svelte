<script lang="ts">
// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
let options: Array<string> | Record<string, string> = []
let selectedOption: string = ''
let disabled: boolean = false
export {
	userClass as class,
	style,
	options,
	selectedOption,
	disabled,
}

if (Array.isArray(options))
{
	options = options.reduce((acc, option) => {
		acc[option] = option
		return acc
	}, {} as Record<string, string>)
}

if (!selectedOption && Object.keys(options).length > 0)
{
	selectedOption = options[0]!
}
</script>

<div class={[userClass, 'flex flex-col space-y-2'].join(' ')} style={style}>
	{#each Object.entries(options) as [option, label]}
		<label class="inline-flex items-center">
			<input
				type="radio"
				class="form-radio text-indigo-600 h-4 w-4"
				value={option}
				bind:group={selectedOption}
				disabled={disabled}
				on:change|preventDefault
			/>
			<span class="ml-2">{label}</span>
		</label>
	{/each}
</div>
