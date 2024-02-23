<script lang="ts">
// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
let options: string[] = []
let selectedOption: string = ''
let disabled: boolean = false
export {
	userClass as class,
	style,
	options,
	selectedOption,
	disabled,
}

if (!selectedOption && options.length > 0)
{
	selectedOption = options[0]!
}
</script>

<div class={[userClass, 'flex flex-col space-y-2'].join(' ')} style={style}>
	{#each options as option}
		<label class="inline-flex items-center">
			<input
				type="radio"
				class="form-radio text-indigo-600 h-4 w-4"
				value={option}
				bind:group={selectedOption}
				disabled={disabled}
			/>
			<span class="ml-2">{option}</span>
		</label>
	{/each}
</div>
