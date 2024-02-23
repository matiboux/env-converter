<script lang="ts">
// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
let options: string[] = []
let selectedOption: string = ''
export {
	userClass as class,
	style,
	options,
	selectedOption,
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
			/>
			<span class="ml-2">{option}</span>
		</label>
	{/each}
</div>
