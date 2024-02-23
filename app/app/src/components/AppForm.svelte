<script lang="ts">
import { parse as dotenvParse } from 'dotenv'

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
let selectedOutputType = outputTypes[1]!
let inputValue = ''
let outputValue = ''

function convert() {
	console.log('Convert')
	outputValue = JSON.stringify(dotenvParse(inputValue), null, 2)
}
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
				<InputSelect options={outputTypes} bind:selectedOption={selectedOutputType} style={'bg-red-500'} disabled />
			</div>
			<p class="text-gray-500 italic">
				Selected output type: {selectedOutputType}
			</p>
		</div>

		<!-- Input value -->
		<div class="space-y-4">
			<label class="block h-64 space-y-2 flex flex-col">
				<span class="text-gray-700">Input value</span>
				<textarea
					class="form-textarea bg-gray-100 mt-1 block w-full p-2 rounded-md flex-1 resize-none"
					rows="3"
					placeholder="Enter some text"
					bind:value={inputValue}
				></textarea>
			</label>

			<div class="flex justify-end space-x-2 pr-4">
				<button class="btn btn-primary" on:click|preventDefault={convert}>
					Convert
				</button>
				<button class="btn btn-secondary">Clear</button>
			</div>
		</div>

		<!-- Output value -->
		<div class="space-y-4">
			<label class="block h-64 space-y-2 flex flex-col">
				<span class="text-gray-700">Output value</span>
				<div class="form-textarea bg-gray-100 mt-1 block w-full p-2 rounded-md flex-1 whitespace-pre">
					{outputValue}
				</div>
			</label>

			<div class="flex justify-start space-x-2 pl-4">
				<button class="btn btn-secondary">Swap</button>
				<button class="btn btn-primary">Copy</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
.btn {
	@apply
		bg-gray-400
		hover:bg-gray-500
		py-2 px-4 rounded-md text-white font-semibold;

	&.btn-primary {
		@apply bg-blue-500 hover:bg-blue-600;
	}
}
</style>
