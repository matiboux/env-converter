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

const defaultInputValue = '# .env example to get you started\nHOST=localhost\nPORT=80\nSECRET=secret'
let inputValue = defaultInputValue
let outputValue = ''
let outputValueElement = null
let convertError: string | null = null

function convertFromEnv(input: string)
{
	return dotenvParse(input)
}

function convertFromJson(input: string)
{
	return JSON.parse(input)
}

const convertFrom: Record<
	string,
	{
		label: string,
		convert: (input: string) => object,
		swapTo?: keyof typeof convertTo,
	}
> = {
	'env': {
		label: '.env file',
		convert: convertFromEnv,
		swapTo: 'env',
	},
	'json': {
		label: 'JSON',
		convert: convertFromJson,
		swapTo: 'json',
	},
}

function convertToEnv(input: object)
{
	return Object.entries(input)
		.map(([key, value]) => `${key}=${value.match(/\s/) ? `"${value}"` : value}`)
		.join('\n')
}

function convertToJsonInline(input: object)
{
	return JSON.stringify(input)
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

const convertTo: Record<
	string,
	{
		label: string,
		convert: (input: object) => string,
		swapTo?: keyof typeof convertFrom,
	}
> = {
	'env': {
		label: '.env file',
		convert: convertToEnv,
		swapTo: 'env',
	},
	'json_inline': {
		label: 'JSON (inline)',
		convert: convertToJsonInline,
		swapTo: 'json',
	},
	'json': {
		label: 'JSON (formatted)',
		convert: convertToJson,
		swapTo: 'json',
	},
	'azure': {
		label: 'Azure',
		convert: convertToAzure,
	},
}

const inputTypes = Object.entries(convertFrom).reduce((acc, [key, {label}]) =>
	{
		acc[key] = label
		return acc
	}, {} as Record<string, string>)

const outputTypes = Object.entries(convertTo).reduce((acc, [key, {label}]) =>
	{
		acc[key] = label
		return acc
	}, {} as Record<string, string>)

let selectedInputType = inputTypes[0]!
let selectedOutputType = persistentAtom<keyof typeof convertTo>('selectedOutputType', outputTypes[2]!)

onMount(() =>
	{
		convert()
	})

function convert()
{
	if (!inputValue)
	{
		outputValue = ''
		convertError = null
		return
	}

	try
	{
		const value = convertFrom[selectedInputType]?.convert(inputValue)
		outputValue = convertTo[$selectedOutputType]?.convert(value)
		convertError = null
	}
	catch (error)
	{
		outputValue = ''
		convertError = error.message
	}
}

function clear()
{
	inputValue = ''
	outputValue = ''
	convertError = null
}

let canSwap: boolean = false
$: canSwap =
	convertError === null &&
	convertFrom[selectedInputType]?.swapTo !== undefined &&
	convertFrom[selectedInputType]?.swapTo !== $selectedOutputType &&
	convertTo[$selectedOutputType]?.swapTo !== undefined &&
	convertTo[$selectedOutputType]?.swapTo !== selectedInputType

let canCopy: boolean = false
$: canCopy = outputValue !== ''

function swap()
{
	if (!canSwap)
	{
		return
	}

	// Swap selected input & output types
	const currentInputType = selectedInputType
	selectedInputType = convertTo[$selectedOutputType].swapTo!
	selectedOutputType.set(convertFrom[currentInputType].swapTo!)

	// Swap input & output values
	const tempValue = inputValue
	inputValue = outputValue
	outputValue = tempValue

	// Convert again
	convert()
}

function copy()
{
	if (!canCopy)
	{
		return
	}

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
					bind:selectedOption={selectedInputType}
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
					{#if convertError}
						<textarea
							class="outputValue form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none text-gray-600 error"
							value={convertError}
							disabled
						></textarea>
					{:else}
						<textarea
							class="outputValue form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none text-gray-600"
							placeholder="Enter some text"
							bind:this={outputValueElement}
							bind:value={outputValue}
							readonly
						></textarea>
					{/if}
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
				<button
					class="btn btn-primary"
					disabled={!canCopy}
					on:click|preventDefault={copy}
				>
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
		enabled:hover:bg-gray-500
		disabled:bg-gray-300
		px-4
		py-2
		text-white
		font-semibold
		rounded-md
		disabled:cursor-not-allowed
		;

	&.btn-primary {
		@apply
			bg-blue-500
			enabled:hover:bg-blue-600
			disabled:bg-blue-300
			;
	}
}

.outputValue {
	@apply
		border
		border-transparent
		;

	&.error {
		@apply border-red-600 text-red-600;
	}
}
</style>
