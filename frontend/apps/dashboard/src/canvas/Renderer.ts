
import { SimulationState, MapBounds } from '../types'
import { DriverEntity }    from './entities/DriverEntity'
import { PassengerEntity } from './entities/PassengerEntity'
import { TripEntity }      from './entities/TripEntity'
import { MAP_BOUNDS }      from '../constants/mapBounds'
import { MapLayer } from './map/MapLayer'

export class Renderer {
  private ctx:        CanvasRenderingContext2D
  private mapLayer:   MapLayer
  private bounds:     MapBounds

  // Maps look up any entity by id in O(1)
  private drivers:    Map<string, DriverEntity>    = new Map()
  private passengers: Map<string, PassengerEntity> = new Map()
  private trips:      Map<string, TripEntity>      = new Map()

  private rafId:      number = 0

  // Store last state so resize() can re-project all positions
  private lastState:  SimulationState | null = null

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx      = canvas.getContext('2d')!
    this.bounds   = MAP_BOUNDS
    this.mapLayer = new MapLayer(canvas.width, canvas.height)
  }

  start(): void {
    const loop = (timestamp: number) => {
      this.frame(timestamp)
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop(): void {
    cancelAnimationFrame(this.rafId)
  }

  resize(w: number, h: number): void {
    this.canvas.width  = w
    this.canvas.height = h
    this.mapLayer.resize(w, h)

    // Re-project all entity positions for the new canvas size.
    // Easiest way: just re-run update() with the last known state.
    if (this.lastState) {
      this.update(this.lastState)
    }
  }


  update(state: SimulationState): void {
    this.lastState = state

    const { width, height } = this.canvas

    for (const dto of state.drivers) {
      if (this.drivers.has(dto.id)) {
        this.drivers.get(dto.id)!.applyDTO(dto, this.bounds, width, height)
      } else {
        this.drivers.set(dto.id, new DriverEntity(dto, this.bounds, width, height))
      }
    }

    const activeDriverIds = new Set(state.drivers.map(d => d.id))
    for (const id of this.drivers.keys()) {
      if (!activeDriverIds.has(id)) this.drivers.delete(id)
    }

    for (const dto of state.passengers) {
      if (this.passengers.has(dto.id)) {
        this.passengers.get(dto.id)!.applyDTO(dto, this.bounds, width, height)
      } else {
        this.passengers.set(dto.id, new PassengerEntity(dto, this.bounds, width, height))
      }
    }
    const activePassengerIds = new Set(state.passengers.map(p => p.id))
    for (const id of this.passengers.keys()) {
      if (!activePassengerIds.has(id)) this.passengers.delete(id)
    }

    // — trips — no bounds/size needed
    for (const dto of state.activeTrips) {
      if (this.trips.has(dto.id)) {
        this.trips.get(dto.id)!.applyDTO(dto)
      } else {
        this.trips.set(dto.id, new TripEntity(dto))
      }
    }
    const activeTripIds = new Set(state.activeTrips.map(t => t.id))
    for (const id of this.trips.keys()) {
      if (!activeTripIds.has(id)) this.trips.delete(id)
    }
  }

  private frame(timestamp: number): void {
    const { ctx } = this
    const { width, height } = ctx.canvas

    this.mapLayer.draw(ctx)

    for (const trip of this.trips.values()) {
      const driver    = this.drivers.get(trip.driverId)
      const passenger = this.passengers.get(trip.passengerId)

      if (driver && passenger) {
        trip.draw(ctx, driver.getPos(), passenger.getPickupPos())
      }
    }

    for (const passenger of this.passengers.values()) {
      passenger.draw(ctx, timestamp)
    }

    for (const driver of this.drivers.values()) {
      driver.update()
      driver.draw(ctx)
    }
  }
}