<script lang="ts">
import InputSelect from '~/components/InputSelect.svelte'

// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
export {
	userClass as class,
	style,
}

const inputTypes = ['.env file', 'JSON']
const outputTypes = ['.env file', 'JSON']
let selectedInputType = inputTypes[0]!
let selectedOutputType = outputTypes[0]!
</script>

<div
	class={[
		userClass,
	].join(' ')}
	style={style}
>

	<!-- Two columns for input & output -->
	<div class="grid grid-cols-2 gap-4">
		<!-- Input type -->
		<div class="space-y-4">
			<div class="block space-y-2">
				<span class="text-gray-700">Input type</span>
				<InputSelect options={inputTypes} bind:selectedOption={selectedInputType} />
			</div>
			<p class="text-gray-500 italic">
				Selected input type: {selectedInputType}
			</p>
		</div>

		<!-- Output type -->
		<div class="space-y-4">
			<div class="block space-y-2">
				<span class="text-gray-700">Output type</span>
				<InputSelect options={outputTypes} bind:selectedOption={selectedOutputType} style={'bg-red-500'} />
			</div>
			<p class="text-gray-500 italic">
				Selected output type: {selectedOutputType}
			</p>
		</div>

		<!-- Input value -->
		<div class="space-y-4">
			<label class="block space-y-2">
				<span class="text-gray-700">Input value</span>
				<textarea class="form-textarea bg-gray-100 mt-1 block w-full p-2 rounded-md" rows="3" placeholder="Enter some text"></textarea>
			</label>
		</div>

		<!-- Output value -->
		<div class="space-y-4">
			<label class="block space-y-2">
				<span class="text-gray-700">Output value</span>
				<div class="form-textarea bg-gray-100 mt-1 block w-full p-2 rounded-md">Output value</div>
			</label>
		</div>
	</div>
</div>
