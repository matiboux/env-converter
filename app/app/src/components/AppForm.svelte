<script lang="ts">
import { onMount } from 'svelte'
import { parse as dotenvParse } from 'dotenv'
import { persistentAtom } from '@nanostores/persistent'

import InputSelect from '~/components/InputSelect.svelte'

// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
export {
	userClass as class,
	style,
}

const defaultInputValue = 'HOST=localhost\nPORT=80\nSECRET=secret'
let inputValue = defaultInputValue
let outputValue = ''
let outputValueElement = null
let convertError: boolean = false

function convertFromEnv(input: string)
{
	return dotenvParse(input)
}

function convertFromJson(input: string)
{
	return JSON.parse(input)
}

const convertFrom = {
	'.env file': convertFromEnv,
	'JSON': convertFromJson,
}

function convertToEnv(input: object)
{
	return Object.entries(input)
		.map(([key, value]) => `${key}=${value}`)
		.join('\n')
}

function convertToJson(input: object)
{
	return JSON.stringify(input, null, 2)
}

function convertToAzure(input: object)
{
	return convertToJson(
		Object.entries(input)
			.map(([key, value]) => ({
				'name': key,
				'value': value,
				'slotSetting': false,
			}))
	)
}

const convertTo = {
	'.env file': convertToEnv,
	'JSON': convertToJson,
	'Azure': convertToAzure,
}

const inputTypes = Object.keys(convertFrom)
const outputTypes = Object.keys(convertTo)
let selectedInputType = persistentAtom('selectedInputType', inputTypes[0]!)
let selectedOutputType = persistentAtom('selectedOutputType', outputTypes[1]!)

onMount(() =>
	{
		convert()
	})

function convert()
{
	console.log('Convert')

	if (!inputValue)
	{
		outputValue = ''
		convertError = false
		return
	}

	try
	{
		const value = convertFrom[$selectedInputType](inputValue)
		outputValue = convertTo[$selectedOutputType](value)
		convertError = false
	}
	catch (error)
	{
		outputValue = error.message
		convertError = true
	}
}

function clear()
{
	inputValue = ''
	outputValue = ''
	convertError = false
}

let canSwap: boolean = false
$: canSwap = outputTypes.includes($selectedInputType) && inputTypes.includes($selectedOutputType)

function swap()
{
	if (!canSwap)
	{
		return
	}

	// Swap selected input & output types
	const tempType = selectedInputType.get()
	selectedInputType.set(selectedOutputType)
	selectedOutputType.set(tempType)

	// Swap input & output values
	const tempValue = inputValue
	inputValue = outputValue
	outputValue = tempValue

	// Convert again
	convert()
}

function copy()
{
	navigator.clipboard.writeText(outputValue)
	if (outputValueElement)
	{
		outputValueElement.focus()
		outputValueElement.select()

	}
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
				<InputSelect
					options={inputTypes}
					bind:selectedOption={$selectedInputType}
					on:change={convert}
				/>
			</div>
		</div>

		<!-- Output type -->
		<div class="space-y-4">
			<div class="block space-y-2">
				<span class="text-gray-700">Output type</span>
				<InputSelect
					style={'bg-red-500'}
					options={outputTypes}
					bind:selectedOption={$selectedOutputType}
					on:change={convert}
				/>
			</div>
		</div>

		<!-- Input value -->
		<div class="space-y-4">
			<label class="block space-y-2 flex flex-col">
				<span class="text-gray-700">Input value</span>
				<div class="h-64">
					<textarea
						class="form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none"
						placeholder="Enter some text"
						bind:value={inputValue}
						on:change|preventDefault={convert}
					></textarea>
				</div>
			</label>

			<div class="flex justify-end space-x-2 pr-4">
				<button class="btn btn-primary" on:click|preventDefault={convert}>
					Convert
				</button>
				<button class="btn btn-secondary" on:click|preventDefault={clear}>
					Clear
				</button>
			</div>
		</div>

		<!-- Output value -->
		<div class="space-y-4">
			<label class="block space-y-2 flex flex-col">
				<span class="text-gray-700">Output value</span>
				<div class="h-64">
					<textarea
						class="outputValue form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none text-gray-600"
						class:error={convertError}
						placeholder="Enter some text"
						bind:this={outputValueElement}
						bind:value={outputValue}
						readonly
					></textarea>
				</div>
			</label>

			<div class="flex justify-start space-x-2 pl-4">
				<button
					class="btn btn-secondary"
					disabled={!canSwap}
					on:click|preventDefault={swap}
				>
					Swap
				</button>
				<button class="btn btn-primary" on:click|preventDefault={copy}>
					Copy
				</button>
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

	&[disabled] {
		@apply
			bg-gray-300
			cursor-not-allowed
			;
	}
}

.outputValue {
	@apply
		border
		border-transparent
		;

	&.error {
		@apply border-red-500 text-red-500;
	}
}
</style>
